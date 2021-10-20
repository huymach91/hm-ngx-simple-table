export interface INgxSimpleTableColumn {
  prop: string;
  title: string;
}

export interface INgxSimpleTableChecked {
  isCheckAll: boolean;
  itemsChecked: Array<any>;
  itemsRemoved: Array<any>;
  indeterminate: boolean;
}

export interface INgxSimpleTableConfig {
  tableClass: string;
  virtualScroll: boolean;
  columns: Array<INgxSimpleTableColumn>;
  fixedHeaderClass?: string;
}

export interface INgxSimpleTableIcon {
  check: string;
  hamburger: string;
  sortAsc: string;
  sortDesc: string;
}
