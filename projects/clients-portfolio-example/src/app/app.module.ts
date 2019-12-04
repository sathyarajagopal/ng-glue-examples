import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PricePublisherComponent } from './price-publisher/price-publisher.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { ClientsComponent } from './clients/clients.component';
import { NgGlue42Module } from '@glue42/ng-glue';
import { Glue42 } from '@glue42/desktop';
import { ToastrModule } from 'ngx-toastr';
import { AgGridModule } from 'ag-grid-angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { routing } from './app.routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const glueConfig: Glue42.Config = {
  agm: true,
  layouts: {
    mode: 'full'
  },
  windows: true,
  appManager: {
    mode: 'full'
  }
};


@NgModule({
  declarations: [
    AppComponent,
    PricePublisherComponent,
    PortfolioComponent,
    ClientsComponent

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgGlue42Module.withConfig(glueConfig),
    ToastrModule.forRoot(),
    CommonModule,
    FormsModule,
    routing,
    NgbModule,
    AgGridModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
