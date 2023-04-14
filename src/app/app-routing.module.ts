import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/parts-lists', pathMatch: 'full' },
  {
    path: 'browse-parts',
    loadChildren: () => import('./browse-parts/browse-parts.module').then(m => m.BrowsePartsModule),
  },
  { path: 'parts-lists', loadChildren: () => import('./parts-list/parts-list.module').then(m => m.PartsListsModule) },
  { path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule) },
  { path: 'info', loadChildren: () => import('./info/info.module').then(m => m.InfoModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
