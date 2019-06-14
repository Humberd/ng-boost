# View Switcher

View Switcher is a convenient solution for switching between different presentation views.

## Features:

* Ready to use - out of the box implements 2 most common view types: `grid` and `table`.
* Persistable - saves currently displayed view type in a storage.
* Extensible - if neccessary easily extends to view types of your choice.  
* Configurable - has both global configuration, so there is no need to repeat yourself,
 and local configuration in case of local override.


## Example:

```angular2html
<boost-view-switcher></boost-view-switcher>

<div *boost-view-grid>
  This is a grid view
</div>

<div *boost-view-table>
  This is a table view
</div>
```


## Installation

1. Import `ViewSwitcherModule` in your `AppModule`:

```typescript
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ViewSwitcherModule.forRoot(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
```

2. Add `ViewSwitcherService` as a provider to a Component you will use View Switcher in.

```typescript
@Component({
  selector: 'app-jobs',
  template: `
    <boost-view-switcher></boost-view-switcher>
    
    <div *boost-view-grid>
      This is a grid view
    </div>
    
    <div *boost-view-table>
      This is a table view
    </div>
  `,
  viewProviders: [
    ViewSwitcherService.configure({
      storageKey: 'appComponent'
    })
  ]
})
export class JobsComponent {
}
```
