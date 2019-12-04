import { Component, OnInit, OnDestroy } from '@angular/core';
import { InteropService } from '@glue42/ng-glue';
import { Subject, timer } from 'rxjs';
import { filter, takeUntil, map } from 'rxjs/operators';
import { Stream } from '@glue42/ng-glue';

@Component({
  selector: 'app-price-publisher',
  templateUrl: './price-publisher.component.html'
})
export class PricePublisherComponent implements OnInit, OnDestroy {
  private symbolSubscriptionsClosed = new Subject<string>();
  private marketStream: Stream;
  private symbolSubscriptionsCount = new Map<string, number>();

  constructor(
    public interopService: InteropService
  ) { }

  public ngOnInit(): void {
    this.createMarketStream();
  }

  public ngOnDestroy(): void {
    if (this.marketStream) {
      this.marketStream.close();
    }
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
        next: (stream: Stream) => this.marketStream = stream,
        error: () => console.error(`Failed to create stream ${streamName}`)
      });
  }

  private onSubscriptionRequest(request): void {
    const symbol = request.arguments.Symbol;
    if (symbol) {
      request.acceptOnBranch(symbol);
    }
  }

  private onSubscriptionAdded(subscription): void {
    const symbol = subscription.arguments.Symbol;

    if (symbol) {
      if (this.symbolSubscriptionsCount.has(symbol) === false) {
        this.symbolSubscriptionsCount.set(symbol, 0);
      }

      const subscriptionsCount = this.symbolSubscriptionsCount.get(symbol);
      const incrementedSubscriptionsCount = subscriptionsCount + 1;
      this.symbolSubscriptionsCount.set(symbol, incrementedSubscriptionsCount);

      if (incrementedSubscriptionsCount === 1) {
        this.startPublishDataOnSymbol(symbol);
      }
    }
  }

  private startPublishDataOnSymbol(symbol: string): void {
    const noSymbolSubscribers = this.symbolSubscriptionsClosed
      .pipe(filter((emittedSymbol) => symbol === emittedSymbol));

    console.log('Start streaming for symbol ', symbol);

    timer(0, 2000)
      .pipe(
        map(() => this.toPublisherFormat(symbol, Math.random() * 100)),
        takeUntil(noSymbolSubscribers)
      )
      .subscribe({
        next: (data) => this.marketStream.push(data, [symbol]),
        complete: () => console.log('Stop streaming for symbol ', symbol)
      });
  }

  private onSubscriptionRemoved(subscription): void {
    const symbol = subscription.arguments.Symbol;

    if (symbol) {
      const subscriptionsCount = this.symbolSubscriptionsCount.get(symbol);
      const decrementedSubscriptionsCount = (subscriptionsCount === 0)
        ? 0
        : subscriptionsCount - 1;

      this.symbolSubscriptionsCount.set(symbol, decrementedSubscriptionsCount);

      if (decrementedSubscriptionsCount === 0) {
        this.symbolSubscriptionsClosed.next(symbol);
      }
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

    return data;
  }
}
