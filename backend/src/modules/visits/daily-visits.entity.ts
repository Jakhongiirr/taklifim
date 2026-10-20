import { Column, Entity, PrimaryColumn } from 'typeorm';

/**
 * Per day (Tashkent): unique site visitors and invitation views. Each visitor
 * counts once a day, and once a day per invitation they open.
 */
@Entity('daily_visits')
export class DailyVisits {
  /** YYYY-MM-DD in Tashkent. */
  @PrimaryColumn({ type: 'date' })
  day: string;

  @Column({ type: 'int', default: 0 })
  visitors: number;

  @Column({ type: 'int', default: 0 })
  invitationViews: number;
}
