import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import type { JwtPayload } from '../auth/auth.types';
import { Role } from '../users/role.enum';
import { PublicTaklifGuestDto, TaklifGuestDto } from './dto/taklif-guest.dto';
import { generateSlug } from './slug';
import { TaklifGuest } from './taklif-guest.entity';
import { TaklifResponse } from './taklif-response.entity';
import { TaklifStatus } from './taklif-status.enum';
import { Taklif } from './taklif.entity';

/** Per invitation, like the replies cap. */
export const MAX_GUESTS = 500;

/**
 * Named guests: the owner lists who they invite and sends each one a
 * personal link that greets them by name. The plain link keeps working for
 * everyone else.
 */
@Injectable()
export class TaklifGuestsService {
  constructor(
    @InjectRepository(Taklif) private readonly taklifs: Repository<Taklif>,
    @InjectRepository(TaklifGuest)
    private readonly guests: Repository<TaklifGuest>,
    @InjectRepository(TaklifResponse)
    private readonly responses: Repository<TaklifResponse>,
  ) {}

  /** The owner's guests in the order they were added, with their replies. */
  async list(id: string, user: JwtPayload): Promise<TaklifGuestDto[]> {
    await this.findOwned(id, user);
    const guests = await this.guests.find({
      where: { taklifId: id },
      order: { createdAt: 'ASC', name: 'ASC' },
    });
    if (!guests.length) return [];
    const replies = await this.responses.find({
      where: { taklifId: id, guestId: In(guests.map((g) => g.id)) },
      order: { createdAt: 'DESC' },
    });
    const latest = new Map<string, TaklifResponse>();
    for (const r of replies) {
      if (r.guestId && !latest.has(r.guestId)) latest.set(r.guestId, r);
    }
    return guests.map((g) => this.toDto(g, latest.get(g.id)));
  }

  /** Adds guests by name, each with a new personal link. */
  async add(
    id: string,
    names: string[],
    user: JwtPayload,
  ): Promise<TaklifGuestDto[]> {
    await this.findOwned(id, user);
    const count = await this.guests.countBy({ taklifId: id });
    if (count + names.length > MAX_GUESTS) {
      throw new ConflictException(
        `An invitation can have at most ${MAX_GUESTS} named guests`,
      );
    }
    const tokens = new Set<string>();
    while (tokens.size < names.length) tokens.add(generateSlug());
    const saved = await this.guests.save(
      [...tokens].map((token, i) =>
        this.guests.create({ taklifId: id, name: names[i], token }),
      ),
    );
    return saved.map((g) => this.toDto(g));
  }

  /** Their link stops greeting them; replies they sent are kept. */
  async remove(id: string, guestId: string, user: JwtPayload) {
    await this.findOwned(id, user);
    const { affected } = await this.guests.delete({
      id: guestId,
      taklifId: id,
    });
    if (!affected) throw new NotFoundException('Guest not found');
  }

  /** For a personal link: the guest's name on a published invitation. */
  async findPublic(slug: string, token: string): Promise<PublicTaklifGuestDto> {
    const guest = await this.guests.findOne({
      where: { token, taklif: { slug, status: TaklifStatus.Published } },
      relations: { taklif: true },
    });
    if (!guest) throw new NotFoundException('Guest not found');
    return { name: guest.name };
  }

  /** The owner's (or, for admins, any) invitation; 404 for anyone else. */
  private async findOwned(id: string, user: JwtPayload) {
    const taklif = await this.taklifs.findOneBy({ id });
    if (!taklif || (taklif.userId !== user.sub && user.role !== Role.Admin)) {
      throw new NotFoundException('Invitation not found');
    }
    return taklif;
  }

  private toDto(g: TaklifGuest, r?: TaklifResponse): TaklifGuestDto {
    return {
      id: g.id,
      name: g.name,
      token: g.token,
      reply: r
        ? { attending: r.attending, guests: r.guests, createdAt: r.createdAt }
        : null,
      createdAt: g.createdAt,
    };
  }
}
