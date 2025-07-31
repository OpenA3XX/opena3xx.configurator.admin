export interface TableColumnConfig {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  maxWidth?: string;
  template?: string;
  actions?: TableAction[];
  type?: 'text' | 'number' | 'date' | 'status' | 'actions' | 'info';
  infoIcon?: string;
  infoTooltip?: (item: any) => string;
}

export interface TableAction {
  label: string;
  icon: string;
  color: 'primary' | 'accent' | 'warn' | 'success';
  action: (item: any) => void;
  disabled?: (item: any) => boolean;
  tooltip?: string;
  tooltipPosition?: 'above' | 'below' | 'left' | 'right';
}

export interface DataTableConfig {
  columns: TableColumnConfig[];
  data: any[];
  loading?: boolean;
  loadingMessage?: string;
  emptyMessage?: string;
  emptyIcon?: string;
  emptyAction?: {
    label: string;
    action: () => void;
  };
  searchPlaceholder?: string;
  searchEnabled?: boolean;
  paginationEnabled?: boolean;
  pageSizeOptions?: number[];
  pageSize?: number;
  sortEnabled?: boolean;
  rowHover?: boolean;
  elevation?: number;
}

export interface DataTableEvent {
  type: 'action' | 'rowClick' | 'search' | 'pageChange' | 'sortChange';
  data?: any;
  action?: TableAction;
}
