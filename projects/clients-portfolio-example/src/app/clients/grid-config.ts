import { ColDef, GridOptions, GridReadyEvent } from 'ag-grid-community';

export const columnDefs: ColDef[] = [
  {
    colId: 'fullName',
    headerName: 'Full Name',
    field: 'preferredName'
  }, {
    colId: 'pId',
    headerName: 'PID',
    field: 'pId'
  }, {
    colId: 'gId',
    headerName: 'GID',
    field: 'gId'
  }, {
    colId: 'accountManager',
    headerName: 'Account Manager',
    field: 'accountManager'
  }
];

export const gridOptions: GridOptions = {
  rowSelection: 'single',
  enableColResize: true,
  columnDefs,
  onGridSizeChanged: ({ api }: GridReadyEvent) => {
    if (api) {
      api.sizeColumnsToFit();
    }
  }
};
