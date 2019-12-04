import { Component, OnInit } from '@angular/core';
import { Subject, of, Observable } from 'rxjs';
import { scan, mergeMap, startWith, map, tap, takeUntil, switchMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { InteropService } from '@glue42/ng-glue';
import { gridOptions } from './grid-config';
import { portfolios } from '../data/portfolios';
import { GridOptions } from 'ag-grid-community';
import { StreamData } from '@glue42/ng-glue';
import { SymbolModel, toSymbolModel } from './portfolio-model';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html'
})
export class PortfolioComponent implements OnInit {
  public gridOptions: GridOptions = gridOptions;
  public updateSymbolsData = new Subject<(symbolsData: SymbolModel[]) => SymbolModel[]>();
  public symbolsData: Observable<SymbolModel[]> = this.updateSymbolsData
    .pipe(
      scan<any>((data, operation) => operation(data), []),
      startWith([])
    );

  private party$ = new Subject<{ gId: string }>();

  constructor(
    public interopService: InteropService,
    public toastrService: ToastrService
  ) { }

  public ngOnInit(): void {
    this.registerSetParty();

    this.party$
      .pipe(
        map(({ gId }) => this.findPortfolio(gId)),
        tap((symbolsData) => this.setSymbols(symbolsData)),
        switchMap((symbolsData) => of(...symbolsData)),
        mergeMap((x) => {
          const streamParams = {
            arguments: {
              Symbol: x.ric
            }
          };
          return this.interopService.readStream('T42.MarketStream.Subscribe', streamParams)
            .pipe(
              takeUntil(this.party$),
            );
        })
      )
      .subscribe((streamData: StreamData) => this.updateSymbol(streamData));
  }

  public registerSetParty(): void {
    this.interopService.register('SetParty', this.setPartyHandler.bind(this))
      .subscribe({
        error: (err) => this.toastrService.error(err.message || err)
      });
  }

  private setPartyHandler({ party }): void {
    this.party$.next(party);
  }

  private setSymbols(symbolsData: SymbolModel[]): void {
    const operation = () => [...symbolsData];
    this.updateSymbolsData.next(operation);
  }

  private updateSymbol({ data }): void {
    const bid = data.image.BID;
    const ask = data.image.ASK;
    const symbolName = data.name;

    const update = (symbolsData: SymbolModel[]) =>
      symbolsData.reduce(
        (acc: SymbolModel[], item: SymbolModel) => {
          if (item.ric === symbolName) {
            return [...acc, { ...item, bid, ask }];
          }

          return [...acc, item];
        }, []);

    this.updateSymbolsData.next(update);
  }

  private findPortfolio(gId: string): SymbolModel[] {
    const portfolio: any = (portfolios.find(x => x.id === gId).Symbols.Symbol || []);
    return portfolio.map(toSymbolModel);
  }
}
