// The legal entity behind taklifim.uz, used in the offer and privacy policy.
// No postal address or phone is published, by the owner's choice.
export const OPERATOR = {
  /** Legal name: an individual entrepreneur (YTT). */
  name: "YTT Ravshanov Jahongir Abdurashidovich",
  /** Taxpayer identification number (STIR / ИНН). */
  tin: "52607025380013",
  email: "jakhongir_ravshanov@icloud.com",
  telegram: "@taklifim_uz_admin",
  site: "taklifim.uz",
};

/** The Telegram handle as a link (the site's "contact" buttons). */
export const TELEGRAM_URL = `https://t.me/${OPERATOR.telegram.replace(/^@/, "")}`;

/** When the documents last changed (shown on the pages). */
export const LEGAL_UPDATED = "2026-10-19";
