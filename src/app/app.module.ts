import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MonthlyGraphComponent } from './monthly-graph/monthly-graph.component';
import { SettingsComponent } from './settings/settings.component';
import {DateValidDirective} from './settings/settings.component';
import { HTTPControllerService } from './httpcontroller.service';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {SidebarModule} from 'ng-sidebar';
import { AngularFontAwesomeModule } from 'angular-font-awesome';


import { CommonModule } from '@angular/common';
import { PlotlyViaWindowModule } from 'angular-plotly.js';
import { CreateExpenseComponent, MaxDirective, MinDirective } from './create-expense/create-expense.component';


@NgModule({
  declarations: [
    AppComponent,
    MonthlyGraphComponent,
    SettingsComponent,
    CreateExpenseComponent,
    DateValidDirective,
    MaxDirective,
    MinDirective
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
    PlotlyViaWindowModule,
  ],
  providers: [HTTPControllerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
