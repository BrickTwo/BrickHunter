import { ILanguage } from '.';

export interface ICountry {
  code: string;
  text: string;
  languages: ILanguage[];
  currency: string;
}
