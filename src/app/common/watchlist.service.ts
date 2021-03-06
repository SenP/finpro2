import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Quote } from './quote.model';
import { WatchlistItem, Watchlist } from './watchlist.model';
import { QuoteService } from './quote.service';

@Injectable()

export class WatchlistService {

  private watchlists: Array<Watchlist> = [];
  private simDelay: number = 1000;

  constructor(private quoteService: QuoteService) { }

  //Get the watchlists (modify later to take userid param)
  getWatchlists() {
    this.watchlists = [];

    // Retrieve watchlists from local storage
    let watchlistsRaw: Watchlist[] = JSON.parse(localStorage.getItem("fpwatchlists"));

    if (watchlistsRaw) {
      watchlistsRaw.forEach(wlraw => {
        let newWL: Watchlist = Object.assign(new Watchlist(), wlraw);
        newWL.instruments = []; //reset so we can create and assign watchlist items      
        wlraw.instruments.forEach(ins => {
          let newWLItem = Object.assign(new WatchlistItem(), ins);
          newWL.instruments.push(newWLItem);
        });
        this.watchlists.push(newWL);
      });
    }
    else {
      this.getSampleWatchlists();
    }
    return this.watchlists;
  }

  // Update all watchlist instruments with the given quotes 
  updateQuotes(qmap: Map<string, Quote>) {
    this.watchlists.forEach(wl => {
      wl.instruments.forEach(stock => {
        let quote = qmap.get(stock.exchange + ':' + stock.instrument);
        if (quote) {
          stock.lastPrice = quote.lastPrice || 0;
          stock.change = quote.change || 0;
          stock.percentChange = quote.percentChange || 0;
        }
      });
    });
  }

  //Save a watchlist, simulate http post delay  
  saveWatchlist(wl): Promise<{ status: string; msg?: string; data?: Watchlist }> {
    let p = new Promise(resolve => setTimeout(() => {
      resolve(this.doSaveWatchlist(wl));
    }, this.simDelay));

    return p;
  }

  //utility: save the edited/new watchlist
  doSaveWatchlist(wlist: Watchlist): { status: string; msg?: string; data?: Watchlist } {
    let i = this.watchlists.findIndex(wl => wl.id === wlist.id);
    let data = null;

    let dupName = this.watchlists.findIndex(wl => (wl.id !== wlist.id) && (wl.name === wlist.name));
    if (dupName !== -1) { //duplicate name found
      return { status: "error", msg: "Duplicate watchlist name" };
    }

    if (i === -1 && this.watchlists.length === 10) { //watchlist limit reached
      return { status: "error", msg: "Can not create more than 10 watchlists" };
    }

    if (i !== -1) { //Edit watchlist
      Object.assign(this.watchlists[i], wlist);
      data = this.watchlists[i];
    }
    else { //Create New watchlist
      wlist.id = this.watchlists.reduce((prev, curr) => prev.id > curr.id ? prev : curr, { id: 0 }).id + 1;
      wlist.instruments = [];
      this.watchlists.push(Object.assign(new Watchlist(), wlist));
      data = this.watchlists[this.watchlists.length - 1];
    }
    localStorage.setItem("fpwatchlists", JSON.stringify(this.watchlists));
    return { status: "success", data: data };
  }

  //Save a watchlist item, simulate http post delay  
  saveWatchlistItem(wlist, wlItem) {
    let p = new Promise(resolve => setTimeout(() => {
      resolve(this.doSaveWatchlistItem(wlist, wlItem));
    }, this.simDelay));

    return p;
  }

  //utility: save the edited/new watchlist item
  doSaveWatchlistItem(wlist, wlItem): any {
    let wl = this.watchlists[this.watchlists.findIndex(w => w.id === wlist.id)];
    let i = wl.instruments.findIndex(ins => ins.instrument === wlItem.instrument);
    let data = null;

    if (i === -1 && wl.instruments.length === 30) { //stocks limit reached
      return { status: "error", msg: "Can not have more than 30 stocks in a watchlist" };
    }

    if (i !== -1) { //edit
      Object.assign(wl.instruments[i], wlItem);
      data = wl.instruments[i];
    }
    else { //create
      wl.instruments.push(Object.assign(new WatchlistItem(), wlItem));
      this.quoteService.register(wlItem.instrument, wlItem.exchange);
      data = wl.instruments[wl.instruments.length - 1];
    }
    localStorage.setItem("fpwatchlists", JSON.stringify(this.watchlists));
    return { status: "success", data: data };
  }

  //simulate http delete of watchlist
  deleteWatchlist(wlist: Watchlist) {
    let p = new Promise(resolve => setTimeout(() => {
      resolve(this.doRemoveWatchlist(wlist));
    }, this.simDelay));

    return p;
  }

  //remove the selected watchlist
  doRemoveWatchlist(wlist: Watchlist) {
    let i = this.watchlists.findIndex(w => w.id === wlist.id);
    let ret = null;

    if (i !== -1) {
      this.watchlists.splice(i, 1);
      //deregister instrument from quote service
      if (wlist.instruments.length > 0) {
        wlist.instruments.forEach(ins => {
          this.quoteService.deregister(ins.instrument, ins.exchange);
        })
      }
    }
    localStorage.setItem("fpwatchlists", JSON.stringify(this.watchlists));
    return { status: "success", data: wlist };
  }

  // simulate http delete of watchlist item
  deleteWatchlistItem(wlist: Watchlist, wlItem: WatchlistItem) {
    let p = new Promise(resolve => setTimeout(() => {
      resolve(this.doRemoveWatchlistItem(wlist, wlItem));
    }, this.simDelay));

    return p;
  }

  //remove the selected watchlist item
  doRemoveWatchlistItem(wlist: Watchlist, wlItem: WatchlistItem) {
    let wl = this.watchlists[this.watchlists.findIndex(w => w.id === wlist.id)];
    let i = wl.instruments.findIndex(ins => ins.instrument === wlItem.instrument);
    let ret = null;

    if (i !== -1) {
      wl.instruments.splice(i, 1);
      this.quoteService.deregister(wlItem.instrument, wlItem.exchange);
    }
    localStorage.setItem("fpwatchlists", JSON.stringify(this.watchlists));
    return { status: "success", data: wlItem };
  }
  // if no watchlists created, load some sample watchlists
  getSampleWatchlists() {
    //1st
    this.watchlists.push(Object.assign(new Watchlist(), {
      id: 1,
      name: 'Technology',
      description: "technology stocks",
      owner: 'sample',
      instruments: []
    }));

    this.watchlists[0].instruments.push(Object.assign(new WatchlistItem(), {
      instrument: 'GOOGL',
      exchange: 'NASDAQ',
      unitsOwned: 100,
      avgPrice: 700
    }));

    this.watchlists[0].instruments.push(Object.assign(new WatchlistItem(), {
      instrument: 'MSFT',
      exchange: 'NASDAQ',
      unitsOwned: 300,
      avgPrice: 52
    }));

    this.watchlists[0].instruments.push(Object.assign(new WatchlistItem(), {
      instrument: 'AMZN',
      exchange: 'NASDAQ',
      unitsOwned: 50,
      avgPrice: 750
    }));

    this.watchlists[0].instruments.push(Object.assign(new WatchlistItem(), {
      instrument: 'AAPL',
      exchange: 'NASDAQ',
      unitsOwned: 200,
      avgPrice: 130
    }));

    //2nd
    this.watchlists.push(Object.assign(new Watchlist(), {
      id: 2,
      name: 'Financials',
      description: "Financial stocks",
      owner: 'sample',
      instruments: []
    }));
    this.watchlists[1].instruments.push(Object.assign(new WatchlistItem(), {
      instrument: 'BAC',
      exchange: 'NYSE',
      unitsOwned: 500,
      avgPrice: 13
    }));
    this.watchlists[1].instruments.push(Object.assign(new WatchlistItem(), {
      instrument: 'WFC',
      exchange: 'NYSE',
      unitsOwned: 200,
      avgPrice: 46
    }));
    this.watchlists[1].instruments.push(Object.assign(new WatchlistItem(), {
      instrument: 'JPM',
      exchange: 'NYSE',
      unitsOwned: 400,
      avgPrice: 60
    }));

    //3rd
    this.watchlists.push(Object.assign(new Watchlist(), {
      id: 3,
      name: 'Telecom',
      description: "Telecommunications Services",
      owner: 'sample',
      instruments: []
    }));
    this.watchlists[2].instruments.push(Object.assign(new WatchlistItem(), {
      instrument: 'T',
      exchange: 'NYSE',
      unitsOwned: 300,
      avgPrice: 40
    }));
    this.watchlists[2].instruments.push(Object.assign(new WatchlistItem(), {
      instrument: 'VZ',
      exchange: 'NYSE',
      unitsOwned: 200,
      avgPrice: 55
    }));
    this.watchlists[2].instruments.push(Object.assign(new WatchlistItem(), {
      instrument: 'VOD',
      exchange: 'NASDAQ',
      unitsOwned: 400,
      avgPrice: 27
    }));

  }

}