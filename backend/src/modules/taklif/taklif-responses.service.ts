import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import type { JwtPayload } from '../auth/auth.types';
import { Role } from '../users/role.enum';
import {
  CreateTaklifResponseDto,
  PublicWishDto,
  TaklifResponseDto,
  TaklifResponsesDto,
} from './dto/taklif-response.dto';
import { TaklifResponse } from './taklif-response.entity';
import { TaklifStatus } from './taklif-status.enum';
import { Taklif } from './taklif.entity';

/** A person needs a few seconds to fill in the form; bots don't wait. */
const MIN_FILL_MS = 3000;
/** Per invitation; beyond this it's flooding, not guests. */
export const MAX_RESPONSES = 500;
const PUBLIC_WISHES_LIMIT = 100;
const LINK =
  /(https?:\/\/|www\.|t\.me\/|@\w{4,}|\b[\w-]+\.(com|uz|ru|net|org|me|io)\b)/i;

/** Guests' RSVPs and wishes; owners like or delete them. */
@Injectable()
export class TaklifResponsesService {
  constructor(
    @InjectRepository(Taklif) private readonly taklifs: Repository<Taklif>,
    @InjectRepository(TaklifResponse)
    private readonly responses: Repository<TaklifResponse>,
  ) {}

  /**
   * A guest's response to a published invitation. Bots that fill the
   * honeypot or send too fast get a normal-looking success with nothing
   * saved, so they can't tell they were caught.
   */
  async create(slug: string, dto: CreateTaklifResponseDto) {
    const taklif = await this.findPublished(slug);
    if (dto.website || dto.elapsedMs < MIN_FILL_MS) return { ok: true };

    const message = dto.message ?? null;
    if (message && LINK.test(message)) {
      throw new BadRequestException('Links are not allowed in wishes');
    }
    const count = await this.responses.countBy({ taklifId: taklif.id });
    if (count >= MAX_RESPONSES) {
      throw new ConflictException('This invitation has too many responses');
    }
    // The same name sending the same wish again (double taps, replays).
    const duplicate = await this.responses.existsBy({
      taklifId: taklif.id,
      name: dto.name,
      message: message ?? IsNull(),
    });
    if (duplicate) return { ok: true };

    await this.responses.save(
      this.responses.create({
        taklifId: taklif.id,
        name: dto.name,
        attending: dto.attending,
        guests: dto.attending ? dto.guests : 1,
        message,
      }),
    );
    return { ok: true };
  }

  /** Wishes on a published invitation: liked first, then newest. */
  async listWishes(slug: string): Promise<PublicWishDto[]> {
    const taklif = await this.findPublished(slug);
    const rows = await this.responses
      .createQueryBuilder('r')
      .where('r.taklifId = :id', { id: taklif.id })
      .andWhere('r.message IS NOT NULL')
      .orderBy('r.likedAt IS NULL', 'ASC')
      .addOrderBy('r.createdAt', 'DESC')
      .limit(PUBLIC_WISHES_LIMIT)
      .getMany();
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      message: r.message!,
      liked: !!r.likedAt,
      createdAt: r.createdAt,
    }));
  }

  /** All responses with totals, for the owner or an admin. */
  async listForOwner(
    id: string,
    user: JwtPayload,
  ): Promise<TaklifResponsesDto> {
    await this.findOwned(id, user);
    const rows = await this.responses.find({
      where: { taklifId: id },
      order: { createdAt: 'DESC' },
    });
    const coming = rows.filter((r) => r.attending);
    return {
      items: rows.map((r) => this.toDto(r)),
      attending: coming.length,
      declined: rows.length - coming.length,
      guests: coming.reduce((sum, r) => sum + r.guests, 0),
    };
  }

  async setLiked(
    id: string,
    responseId: string,
    liked: boolean,
    user: JwtPayload,
  ): Promise<TaklifResponseDto> {
    await this.findOwned(id, user);
    const response = await this.findResponse(id, responseId);
    response.likedAt = liked ? (response.likedAt ?? new Date()) : null;
    return this.toDto(await this.responses.save(response));
  }

  async remove(id: string, responseId: string, user: JwtPayload) {
    await this.findOwned(id, user);
    await this.findResponse(id, responseId);
    await this.responses.delete(responseId);
  }

  private async findPublished(slug: string) {
    const taklif = await this.taklifs.findOneBy({
      slug,
      status: TaklifStatus.Published,
    });
    if (!taklif) throw new NotFoundException('Invitation not found');
    return taklif;
  }

  /** The owner's (or, for admins, any) invitation; 404 for anyone else. */
  private async findOwned(id: string, user: JwtPayload) {
    const taklif = await this.taklifs.findOneBy({ id });
    if (!taklif || (taklif.userId !== user.sub && user.role !== Role.Admin)) {
      throw new NotFoundException('Invitation not found');
    }
    return taklif;
  }

  private async findResponse(taklifId: string, id: string) {
    const response = await this.responses.findOneBy({ id, taklifId });
    if (!response) throw new NotFoundException('Response not found');
    return response;
  }

  private toDto(r: TaklifResponse): TaklifResponseDto {
    return {
      id: r.id,
      name: r.name,
      attending: r.attending,
      guests: r.guests,
      message: r.message,
      liked: !!r.likedAt,
      createdAt: r.createdAt,
    };
  }
}
