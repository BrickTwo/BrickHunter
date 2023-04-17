import { BackgroundReadCartResponse } from '.';

export interface BackgroundResponse {
  error?: {
    status: number;
    message: string;
  };
  success?: BackgroundReadCartResponse[];
}
