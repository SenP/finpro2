// Modules
import { NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';
import { FormsModule }   from '@angular/forms';
import { TypeaheadModule } from 'ng2-bootstrap/ng2-bootstrap';
// Components
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar';
import { WatchlistsComponent } from './watchlist';
import { WatchlistComponent } from './watchlist';
import { DashboardComponent } from './dashboard';
import { FPChartComponent } from './dashboard';
import { TopstocksComponent } from './dashboard';
// Directives
import { SignDirective } from './common';
import { FilterArrPipe } from './common';
import { CHART_DIRECTIVES } from 'angular2-highcharts';
// Services
import { WatchlistService } from './common';
import { QuoteService } from './common';

@NgModule({

    imports: [  HttpModule,
                JsonpModule,
                BrowserModule,
                FormsModule,
                TypeaheadModule ],

  declarations: [ CHART_DIRECTIVES,
                SignDirective,
                FilterArrPipe,
                NavbarComponent,
                FPChartComponent,
                TopstocksComponent,
                DashboardComponent,
                WatchlistsComponent,
                WatchlistComponent,     
                AppComponent ],  

    providers: [FilterArrPipe, 
                QuoteService,
                WatchlistService],

    bootstrap: [AppComponent]
 })

export class AppModule { }