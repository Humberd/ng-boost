# View Switcher

View Switcher is a convenient solution for switching between different presentation views.

## Features:

* **Ready to use** - out of the box implements 2 most common view types: `grid` and `table`.
* **Persistable** - saves currently displayed view type in a storage.
* **Extensible** - easily extends to view types of your choice.  
* **Configurable** - has both global configuration, so there is no need to repeat yourself,
 and local configuration in case of a local override.


## How to use?

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

## Configuration

|   | description | defaultValue | scope |
|---| --- | --- | --- |
| viewTypes | A List of available view types | \[grid,table\] | global, local |
| defaultType | Selectes a view that should be displayed when presented for the first time. | 'table' | global, local |
| storageKey | A key, by which the ViewSwitcher saves the state in a storage. **Must be unique.** | --- | local |
| storage | A reference to a persistent storage object. | localStorage | global, local |


## Examples:

### 1. Save to a `sessionStorage`

```typescript
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ViewSwitcherModule.forRoot({
      storage: sessionStorage
    }),
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
```

### 2. Display 2 View Switchers next to each other.

```typescript
@Component({
  selector: 'app-root',
  template: `
    <app-users></app-users>
    
    <app-organizations></app-organizations>
  `
})
export class AppComponent {
}

@Component({
  selector: 'app-users',
  template: `
    <boost-view-switcher></boost-view-switcher>
    
    <div *boost-view-grid>
      This is users Grid View
    </div>
    
    <div *boost-view-table>
      This is users Table View
    </div>
  `,
  viewProviders: [
    ViewSwitcherService.configure({
      storageKey: 'users'
    })
  ]
})
export class UsersComponent {
}

@Component({
  selector: 'app-organizations',
  template: `
    <boost-view-switcher></boost-view-switcher>
    
    <div *boost-view-grid>
      This is organizations Grid View
    </div>
    
    <div *boost-view-table>
      This is organizations Table View
    </div>
  `,
  viewProviders: [
    ViewSwitcherService.configure({
      storageKey: 'organizations'
    })
  ]
})
export class OrganizationsComponent {
}
````

### 3. Display 2 additional views (circles and triangles)

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
    
    <div *boost-view="'circles'">
      This is a circles view
    </div>
    
    <div *boost-view="'triangles'">
      This is a triangles view
    </div>
  `,
  viewProviders: [
    ViewSwitcherService.configure({
      storageKey: 'appComponent',
      viewTypes: [ 
        ...defaultViewTypes(),
        {
          id: 'circles', // or either add it to a Module Configuration
          icon: 'mat-circles' 
        },
        {
          id: 'triangles',
          icon: 'mat-triangles'
        }
      ]
    })
  ]
})
export class JobsComponent {
}
```


Or instad of using `*boost-view="'circles'"` you can create your own directive:

```typescript
@Directive({
  selector: '[appViewCircles],[app-view-circles]'
})
export class ViewTableDirective extends ViewSelector {
  viewType: AvailableViewType = 'circles';
}
```

And then use it along others:

```html
<boost-view-switcher></boost-view-switcher>

<div *boost-view-grid>
  This is a grid view
</div>

<div *boost-view-table>
  This is a table view
</div>

<div *app-view-circles>
  This is a circles view
</div>

<div *app-view-triangles>
  This is a triangles view
</div>
```
