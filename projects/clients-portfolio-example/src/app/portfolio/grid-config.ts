import { ColDef, GridOptions, GridReadyEvent } from 'ag-grid-community';

export const columnDefs: ColDef[] = [
  {
    colId: 'symbol',
    headerName: 'Symbol',
    field: 'ric'
  }, {
    colId: 'description',
    headerName: 'Description',
    field: 'description'
  },
  {
    colId: 'bid',
    headerName: 'Bid',
    field: 'bid'
  }, {
    colId: 'ask',
    headerName: 'Ask',
    field: 'ask'
  }
];

export const gridOptions: GridOptions = {
  enableColResize: true,
  columnDefs,
  onGridSizeChanged: ({ api }: GridReadyEvent) => {
    if (api) {
      api.sizeColumnsToFit();
    }
  }
};
