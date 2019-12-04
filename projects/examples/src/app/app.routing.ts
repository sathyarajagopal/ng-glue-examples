import { Routes, RouterModule } from '@angular/router';

import { LayoutsDemoComponent } from './layouts/layouts-demo.component';
import { InteropDemoComponent } from './interop/interop-demo.component';
import { HomeComponent } from './home/home.component';
import { WindowsComponent } from './windows/windows.component';
import { GdWindowComponent } from './gd-window/gd-window.component';
import { AppManagerDemoComponent } from './app-manager/app-manager-demo.component';
import { NotificationsComponent } from './notifications/notifications.component';

const routes: Routes = [
  {
    path: 'app-manager',
    component: AppManagerDemoComponent
  },
  {
    path: 'interop',
    component: InteropDemoComponent
  },
  {
    path: 'layouts',
    component: LayoutsDemoComponent
  },
  {
    path: 'windows',
    component: WindowsComponent
  },
  {
    path: 'gd-window',
    component: GdWindowComponent
  },
  {
    path: 'notifications',
    component: NotificationsComponent
  },
  {
    path: 'home',
    redirectTo: '/'
  },

  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

export const routing = RouterModule.forRoot(routes, { useHash: true });
