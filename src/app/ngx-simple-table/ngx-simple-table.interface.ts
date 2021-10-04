export interface ISimpleTableColumn {
  prop: string;
  title: string;
}

export interface ISimpleTableChecked {
  isCheckAll: boolean;
  itemsChecked: Array<any>;
  itemsRemoved: Array<any>;
  indeterminate: boolean;
}

export interface ISimpleTableConfig {
  tableClass: string;
  virtualScroll: boolean;
  columns: Array<ISimpleTableColumn>;
}
