import { Component, OnChanges, Input } from '@angular/core';
import { WatchlistItem, FilterArrPipe } from '../common';

@Component({
    selector: 'fp-topstocks',
    templateUrl: './topstocks.component.html',
    styles: [`                               
                .stkTable {
                    background: white
                }                
        `]
})

export class TopstocksComponent implements OnChanges {

    @Input('stocks') allStocks: Map<string, WatchlistItem[]>;
    @Input() title;
    @Input() orderBy;
    @Input() numItems;
    @Input() sliceMode;

    filteredStocks: Object[] = [];

    constructor(private filterListPipe: FilterArrPipe) { } 

    ngOnChanges() {
        this.filteredStocks = this.filterListPipe.transform(this.getFlatList(), this.orderBy, this.numItems, this.sliceMode);
        
        if (this.sliceMode === 'bottom') {
            this.filteredStocks.reverse();
        }
    }

    getFlatList(): Object[] {
        // aggregate the values for the same stock and create a flat list
        let flatList = [];
        this.allStocks.forEach((stocks, key) => {
            let [instrument, exchange] = key.split(':');
            let value = 0;
            stocks.forEach(stock => value += stock[this.orderBy]);
            flatList.push({ instrument, exchange, [this.orderBy]: value });
        });
        return flatList;
    }
}
