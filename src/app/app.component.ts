import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from './navbar';
import { Watchlist, WatchlistItem, WatchlistService, QuoteService, Quote } from './common';

@Component({
    selector: 'finpro-app',
    templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {

    watchlists: Watchlist[] = [];
    selectedWatchlist: Watchlist;
    refInterval: number = 60;
    refFreqs: [number, string][] = [
        [10, '10 sec'], [30, '30 sec'], [60, '1 min'], [300, '5 min'], [600, '10 min'],
        [900, '15 min'], [1200, '20 min'], [1800, '30 min'], [3600, '60 min']
    ];

    constructor(private watchlistService: WatchlistService,
        private quoteService: QuoteService) { }

    ngOnInit() {
        // Get all watchlist from local storage
        this.watchlists = this.watchlistService.getWatchlists();

        //register all instruments with quote service
        this.watchlists.forEach(wl => {
            wl.instruments.forEach(stock => {
                this.quoteService.register(stock.instrument, stock.exchange);
            });
        });

        // Start quote service and update quotes at refInterval
        this.quoteService
            .init(this.refInterval * 1000)
            .subscribe(qmap => {
                this.watchlistService.updateQuotes(qmap);
            });

        // Load the supported tickers
        this.quoteService.getTickers();
    }

    onSelect(wl) {
        // Keep track of current watchlist being displayed, null for dashboard display
        this.selectedWatchlist = wl;
    }

    onChangeTimer(val) {
        // Reset timer to new interval
        this.refInterval = val;
        this.quoteService.resetTimer(this.refInterval * 1000);
    }
}
