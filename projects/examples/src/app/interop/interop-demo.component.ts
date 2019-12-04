import { Component } from '@angular/core';
import { AppManagerService } from '@glue42/ng-glue';

@Component({
  selector: 'app-interop-demo',
  templateUrl: './interop-demo.component.html'
})
export class InteropDemoComponent {

  constructor(
    public appManagerService: AppManagerService
  ) { }

  public launchApps() {
    this.openClients();
    this.openPortfolio();
  }

  public openClients(): void {
    this.appManagerService.start('ng-glue42-clients')
      .subscribe({
        error: err => console.error('Unable to open Clients app ', err)
      });
  }

  public openPortfolio(): void {
    this.appManagerService.start('ng-glue42-portfolio')
      .subscribe({
        error: err => console.error('Unable to open Portfolio app', err)
      });
  }
}
