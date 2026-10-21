import { Column, Entity, PrimaryColumn } from 'typeorm';

/**
 * Per day (Tashkent): where the day's site visitors came from, split by
 * whether they landed on an invitation or the rest of the site. Each visitor
 * counts once a day, under the source of their first visit that day.
 */
@Entity('daily_sources')
export class DailySources {
  /** YYYY-MM-DD in Tashkent. */
  @PrimaryColumn({ type: 'date' })
  day: string;

  /** "google", "instagram", "direct", ... or another site's domain. */
  @PrimaryColumn({ type: 'varchar', length: 64 })
  source: string;

  /** Landed on the site itself (home, designs, articles, ...). */
  @Column({ type: 'int', default: 0 })
  site: number;

  /** Landed on someone's invitation. */
  @Column({ type: 'int', default: 0 })
  invitation: number;
}
