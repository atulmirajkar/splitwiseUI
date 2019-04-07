import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MonthlyGraphComponent } from './monthly-graph/monthly-graph.component';
import { SettingsComponent } from './settings/settings.component';
import { HTTPControllerService } from './httpcontroller.service';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {SidebarModule} from 'ng-sidebar';
import { AngularFontAwesomeModule } from 'angular-font-awesome';


import { CommonModule } from '@angular/common';
import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';
PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    AppComponent,
    MonthlyGraphComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    SidebarModule.forRoot(),
    AngularFontAwesomeModule,
    HttpClientModule,
    CommonModule,
    PlotlyModule
  ],
  providers: [HTTPControllerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
