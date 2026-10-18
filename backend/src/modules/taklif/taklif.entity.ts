import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { File } from '../files/file.entity';
import { Music } from '../music/music.entity';
import { Theme } from '../themes/theme.entity';
import { User } from '../users/user.entity';
import { TaklifPhoto } from './taklif-photo.entity';
import { TaklifStatus } from './taklif-status.enum';

/** A wedding invitation. */
@Entity('taklif')
export class Taklif {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Short public identifier for the invitation's URL. */
  @Index('UQ_taklif_slug', { unique: true })
  @Column({ length: 16 })
  slug: string;

  @Index()
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Index()
  @Column({ type: 'enum', enum: TaklifStatus, default: TaklifStatus.Draft })
  status: TaklifStatus;

  @Column({ length: 100 })
  brideName: string;

  @Column({ length: 100 })
  groomName: string;

  @Column({ length: 100 })
  hostName: string;

  /** When the wedding starts. */
  @Column({ type: 'timestamptz' })
  eventAt: Date;

  /**
   * `eventAt` when the invitation was first published. From then on owners
   * can change the date at most MAX_EVENT_AT_CHANGES times, so a paid
   * invitation can't be kept alive forever by pushing its date.
   */
  @Column({ type: 'timestamptz', nullable: true })
  lockedEventAt: Date | null;

  /** Times the owner has changed `eventAt` since the first publish. */
  @Column({ type: 'int', default: 0 })
  eventAtChanges: number;

  /**
   * When it was paid for (payment publishes it); null while unpaid. Once
   * paid, the owner publishes and hides it freely, but can't change the
   * theme the price was paid for.
   */
  @Column({ type: 'timestamptz', nullable: true })
  paidAt: Date | null;

  @Column({ length: 200 })
  venueName: string;

  @Column({ length: 300 })
  venueAddress: string;

  /** A Google or Yandex Maps link; optional. */
  @Column({ type: 'varchar', length: 500, nullable: true })
  locationUrl: string | null;

  /** The venue's pin, picked on the map; both or neither. */
  @Column({ type: 'double precision', nullable: true })
  latitude: number | null;

  @Column({ type: 'double precision', nullable: true })
  longitude: number | null;

  /** Digits only. */
  @Column({ type: 'varchar', length: 19, nullable: true })
  cardNumber: string | null;

  /** E.164. */
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  /** Optional background music. */
  @Column({ type: 'uuid', nullable: true })
  musicId: string | null;

  @ManyToOne(() => Music, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'musicId' })
  music: Music | null;

  /**
   * The couple's own music instead of a library track: an audio file they
   * uploaded. Never set together with `musicId`.
   */
  @Index('UQ_taklif_customMusicFileId', { unique: true })
  @Column({ type: 'uuid', nullable: true })
  customMusicFileId: string | null;

  // RESTRICT: the file can't be deleted while the invitation uses it.
  @ManyToOne(() => File, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'customMusicFileId' })
  customMusicFile: File | null;

  @Column({ type: 'uuid' })
  themeId: string;

  @ManyToOne(() => Theme, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'themeId' })
  theme: Theme;

  @OneToMany(() => TaklifPhoto, (photo) => photo.taklif)
  photos: TaklifPhoto[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
