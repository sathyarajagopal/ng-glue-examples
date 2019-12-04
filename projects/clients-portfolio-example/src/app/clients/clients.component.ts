import { Component } from '@angular/core';
import { gridOptions } from './grid-config';
import { clients } from './../data/clients';
import { InteropService } from '@glue42/ng-glue';
import { ToastrService } from 'ngx-toastr';
import { GridOptions } from 'ag-grid-community';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html'
})
export class ClientsComponent {

  public gridOptions: GridOptions = gridOptions;
  public clients = clients;

  constructor(
    public interopService: InteropService,
    public toastrService: ToastrService
  ) { }

  public rowSelected(event: any): void {
    const selectedNodes = event.api.getSelectedNodes() || [];

    if (selectedNodes.length > 0) {
      const { data: selectedClient } = selectedNodes[0];
      this.invokeSetParty(selectedClient);
    }
  }

  private invokeSetParty({ gId }): void {
    const party = { gId };
    this.interopService.invoke('SetParty', { party })
      .subscribe({
        error: (err) => this.toastrService.error(err.message || err)
      });
  }
}
