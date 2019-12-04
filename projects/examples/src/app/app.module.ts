import { AgGridModule } from 'ag-grid-angular';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { NgGlue42Module } from '@glue42/ng-glue';

import { glueConfig } from './glue-config';

import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { LayoutsDemoComponent } from './layouts/layouts-demo.component';
import { routing } from './app.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InteropDemoComponent } from './interop/interop-demo.component';
import { WindowsComponent } from './windows/windows.component';
import { HomeComponent } from './home/home.component';
import { GdWindowComponent } from './gd-window/gd-window.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppManagerDemoComponent } from './app-manager/app-manager-demo.component';
import { NotificationsComponent } from './notifications/notifications.component';

import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PricePublisherComponent } from './interop/price-publisher/price-publisher.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutsDemoComponent,
    InteropDemoComponent,
    WindowsComponent,
    HomeComponent,
    GdWindowComponent,
    AppManagerDemoComponent,
    NotificationsComponent,
    PricePublisherComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    routing,
    NgbModule,
    AgGridModule,
    NgGlue42Module.withConfig(glueConfig),
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    HttpClientModule,
    MarkdownModule.forRoot({
      loader: HttpClient,
      markedOptions: {
        provide: MarkedOptions,
        useValue: {
          gfm: true,
          tables: true,
          breaks: false,
          pedantic: false,
          sanitize: false,
          smartLists: true,
          smartypants: false,
        },
      },
    }),

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
