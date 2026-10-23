import { BadRequestException } from '@nestjs/common';
import { TaklifOccasion } from './taklif-occasion.enum';

/** The plov design's `themeId`: its invitations are always a plov. */
export const PLOV_THEME_ID = 'plov';

/**
 * The occasion an invitation in the design `themeId` gets. The plov design is
 * always a plov, and only it is; other designs keep `requested`, else
 * `current`, else a wedding. Asking for a plov on another design, or for
 * anything else on the plov design, is rejected.
 */
export function resolveOccasion(
  themeId: string,
  requested?: TaklifOccasion,
  current?: TaklifOccasion,
): TaklifOccasion {
  if (themeId === PLOV_THEME_ID) {
    if (requested && requested !== TaklifOccasion.Plov) {
      throw new BadRequestException('The plov design is always a plov');
    }
    return TaklifOccasion.Plov;
  }
  if (requested === TaklifOccasion.Plov) {
    throw new BadRequestException('occasion plov is only for the plov design');
  }
  if (requested) return requested;
  return current && current !== TaklifOccasion.Plov
    ? current
    : TaklifOccasion.Wedding;
}
