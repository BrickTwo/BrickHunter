import { BackgroundRequestAction, BackgroundRequestService } from '.';

export interface BackgroundRequest {
  service: BackgroundRequestService;
  action: BackgroundRequestAction;
}
