import { Language } from '.';

export interface Country {
  code: string;
  text: string;
  languages: Language[];
  currency: string;
}
