# ngx-simple-table

Angular version 12.1.0. [Stackblitz](https://www.buymeacoffee.com/huymax)

## Demo

[Stackblitz](https://stackblitz.com/edit/hm-ngx-simple-table)

## Features

The table has basic features as below:

- pagination (from backend)
- check item
- check all items in a page
- check all items in all pages
- fixed header
- fixed scrollbar
- resizable columns
- fixed column

# How to use

```javascript
<ngx-simple-table
  [config]="simpleTableConfig"
  [data]="data"
  [icons]="icons"
  [totalRecord]="pagination.totalRecord"
  [currentPage]="pagination.currentPage"
  [pageSize]="pagination.pageSize"
  (onChecked)="onChecked($event)"
  (onSort)="onSort($event)"
  (onChangePaginator)="onChangePaginator($event)"
>
</ngx-simple-table>
```

```javascript
<ngx-fixed-column-table
  [config]="fixedColumnTableConfig"
  [data]="data"
  [icons]="icons"
  [totalRecord]="pagination.totalRecord"
  [currentPage]="pagination.currentPage"
  [pageSize]="pagination.pageSize"
  (onChecked)="onChecked($event)"
  (onSort)="onSort($event)"
  (onChangePaginator)="onChangePaginator($event)"
>
</ngx-fixed-column-table>
```

## Screenshots

![App Screenshot](https://raw.githubusercontent.com/huymach91/hm-ngx-simple-table/master/src/assets/ngx-simple-table.png?token=AHXRERMF7N6U4HSCDK5WX43BN7FHU)

![App Screenshot](https://raw.githubusercontent.com/huymach91/hm-ngx-simple-table/master/src/assets/ngx-sticky-column.png)

## Browser Support

Latest Chrome.
