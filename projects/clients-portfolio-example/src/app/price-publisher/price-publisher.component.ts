import { Component, OnInit } from '@angular/core';
import { InteropService } from '@glue42/ng-glue';
import { Subject, timer } from 'rxjs';
import { filter, takeUntil, map } from 'rxjs/operators';

@Component({
  selector: 'app-price-publisher',
  templateUrl: './price-publisher.component.html'
})
export class PricePublisherComponent implements OnInit {
  private symbolSubscriptionsClosed = new Subject<string>();
  private marketStream;
  private symbolSubscriptions = new Map<string, number>();

  constructor(
    public interopService: InteropService
  ) { }

  public ngOnInit(): void {
    this.createMarketStream();
  }

  private createMarketStream(): void {
    const streamName = 'T42.MarketStream.Subscribe';
    const streamDefinition = {
      name: 'T42.MarketStream.Subscribe',
      accepts: 'String Symbol'
    };
    const streamOptions = {
      subscriptionRequestHandler: this.onSubscriptionRequest.bind(this),
      subscriptionAddedHandler: this.onSubscriptionAdded.bind(this),
      subscriptionRemovedHandler: this.onSubscriptionRemoved.bind(this)
    };

    this.interopService.createStream(streamDefinition, streamOptions)
      .subscribe({
        next: (stream) => this.marketStream = stream,
        error: () => console.error(`Failed to create stream ${streamName}`)
      });
  }

  private onSubscriptionRequest(request: any): void {
    const symbol = request.arguments.Symbol;
    if (symbol) {
      request.acceptOnBranch(symbol);
    }
  }

  private onSubscriptionAdded(subscription) {
    const symbol = subscription.arguments.Symbol;

    if (this.symbolSubscriptions.has(symbol)) {
      const subscriptions = this.symbolSubscriptions.get(symbol);
      this.symbolSubscriptions.set(symbol, subscriptions + 1);

      return;
    } else {
      this.symbolSubscriptions.set(symbol, 1);
    }

    this.startPublishDataOnSymbol(symbol);
  }

  private startPublishDataOnSymbol(symbol: string): void {
    const noSymbolSubscribers = this.symbolSubscriptionsClosed
      .pipe(filter((emittedSymbol) => symbol === emittedSymbol));

    timer(0, 2000)
      .pipe(
        map(() => this.toPublisherFormat(symbol, 20)),
        takeUntil(noSymbolSubscribers)
      )
      .subscribe({
        next: (data) => this.marketStream.push(data, [symbol]),
        complete: () => console.log('Complete on symbol ', symbol)
      });
  }

  private onSubscriptionRemoved(subscription): void {
    const symbol = subscription.arguments.Symbol;
    if (!symbol) {
      return;
    }

    const subscriptions = this.symbolSubscriptions.get(symbol);
    const leftNumberSubscriptions = (subscriptions > 0) ? subscription - 1 : 0;
    this.symbolSubscriptions.set(symbol, leftNumberSubscriptions);

    if (leftNumberSubscriptions === 0) {
      this.symbolSubscriptionsClosed.next(symbol);
    }
  }

  private toPublisherFormat(symbol: string, tradePrice: number) {
    const data = {
      name: symbol,
      image: {
        BID: parseFloat((tradePrice - Math.random()).toString()).toFixed(2),
        ASK: parseFloat((tradePrice + Math.random()).toString()).toFixed(2),
      }
    };

    const payload = {
      data
    };
    return payload;
  }
}
