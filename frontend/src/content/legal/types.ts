/** A paragraph, or a bulleted list. */
export type LegalBlock = string | { list: string[] };

export interface LegalDoc {
  title: string;
  intro: string[];
  sections: { title: string; body: LegalBlock[] }[];
}
