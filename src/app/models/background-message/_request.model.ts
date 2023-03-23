import { BackgroundRequestAction, BackgroundRequestService } from '.';

export interface IBackgroundRequest {
  service: BackgroundRequestService;
  action: BackgroundRequestAction;
}
