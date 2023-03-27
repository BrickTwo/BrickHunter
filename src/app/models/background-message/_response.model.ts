import { IBackgroundReadCartResponse } from '.';

export interface IBackgroundResponse {
  error?: {
    status: number;
    message: string;
  };
  success?: IBackgroundReadCartResponse[];
}
