import { Routes, RouterModule } from '@angular/router';
import { ClientsComponent } from './clients/clients.component';
import { PortfolioComponent } from './portfolio/portfolio.component';

const routes: Routes = [
  {
    path: 'clients',
    component: ClientsComponent
  },
  {
    path: 'portfolio',
    component: PortfolioComponent
  },

  { path: '', component: ClientsComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

export const routing = RouterModule.forRoot(routes, { useHash: true });
