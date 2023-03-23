import { NgModule, Optional, SkipSelf } from '@angular/core';
import { BrickHunterApiService } from './http/brickhunterapi.service';
import { ColorService } from './services/color.service';
import { GuidService } from './services/guid.service';
import { IndexedDBService } from './services/indexeddb.service.ts';
import { PickABrickService } from './services/pickabrick.service';
 
@NgModule({
  imports: [
  ],
  providers: [
    BrickHunterApiService,
    ColorService,
    GuidService,
    PickABrickService,
    IndexedDBService
  ],
  declarations: []
})
export class CoreModule { 
 
  constructor(@Optional() @SkipSelf() core:CoreModule ){
    if (core) {
        throw new Error("You should import core module only in the root module")
    }
  }
}