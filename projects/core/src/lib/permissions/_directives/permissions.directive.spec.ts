import { PermissionsDirective } from './permissions.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoostPermissionsModule } from '../boost-permissions.module';
import { Component, Type } from '@angular/core';
import { By } from '@angular/platform-browser';
import { GlobalRoleService } from '../_services/global-role.service';
import { LocalRoleService } from '../_services/local-role.service';
import { Permission, PERMISSIONS_LOADER, PermissionsLoader } from '../_services/roles-cache.service';
import { Observable, of, throwError } from 'rxjs';

const TEST_ROLES = {
  DUMMY: [],
  USER: ['user.read'],
  ADMIN: ['user.read', 'user.create']

};

describe('PermissionsDirective', () => {
  let globalRoleService: GlobalRoleService;
  let localRoleService: LocalRoleService;

  function createComponent<T>(component: Type<T>) {
    TestBed.configureTestingModule({
      declarations: [
        component
      ],
      imports: [
        BoostPermissionsModule.forRoot()
      ],
      providers: [
        {
          provide: PERMISSIONS_LOADER,
          useValue: {
            load(roleName: string): Observable<Permission[]> {
              if (!TEST_ROLES[roleName]) {
                return throwError('Role doesn\'t exist');
              }
              return of(TEST_ROLES[roleName]);
            }
          } as PermissionsLoader
        }
      ]
    });

    globalRoleService = TestBed.get(GlobalRoleService);
    localRoleService = TestBed.get(LocalRoleService);

    return TestBed.createComponent(component);
  }

  describe('Permissions change template rendering', () => {
    @Component({
      template: `
        <div *boostPermissions="permissions">
          Hello
        </div>
      `
    })
    class TestComp {
      permissions = 'user.read';
    }

    it('should not show a template when user role hasn\'t been initialized', () => {
      const fixture = createComponent(TestComp);
      fixture.detectChanges();

      const div = queryElement(fixture, 'div');
      expect(div).toBeFalsy();
    });

    it('should toggle views when global user role changes', () => {
      const fixture = createComponent(TestComp);
      globalRoleService.set('USER');
      fixture.detectChanges();

      const div1 = queryElement(fixture, 'div');
      expect(div1).toBeDefined();

      globalRoleService.set('DUMMY');
      fixture.detectChanges();

      const div2 = queryElement(fixture, 'div');
      expect(div2).toBeFalsy();
    });

    it('should toggle views when required permissions change', () => {
      const fixture = createComponent(TestComp);
      globalRoleService.set('USER');
      fixture.detectChanges();

      const div1 = queryElement(fixture, 'div');
      expect(div1).toBeDefined();

      fixture.componentInstance.permissions = 'user.remove';
      fixture.detectChanges();

      const div2 = queryElement(fixture, 'div');
      expect(div2).toBeFalsy();
    });

  });

  describe('Then template rendering', () => {
    @Component({
      template: `
        <div *boostPermissions="'user.read'; then success">
          Hello
        </div>

        <ng-template #success>
          <div>
            I am allowed
          </div>
        </ng-template>
      `
    })
    class TestComp {

    }

    it('should render then template instead of elements inside', () => {
      const fixture = createComponent(TestComp);
      globalRoleService.set('USER');
      fixture.detectChanges();

      const div1 = queryElement(fixture, 'div');
      expect(div1.nativeElement.innerHTML.trim()).toBe('I am allowed');

      globalRoleService.set('DUMMY');
      fixture.detectChanges();

      const div2 = queryElement(fixture, 'div');
      expect(div2).toBeFalsy();
    });
  });

  describe('Else template rendering', () => {
    @Component({
      template: `
        <div *boostPermissions="'user.read'; else fail">
          Hello
        </div>

        <ng-template #fail>
          <div>
            Not allowed
          </div>
        </ng-template>
      `
    })
    class TestComp {

    }

    it('should render else template when there is no permission', () => {
      const fixture = createComponent(TestComp);
      globalRoleService.set('USER');
      fixture.detectChanges();

      const div1 = queryElement(fixture, 'div');
      expect(div1.nativeElement.innerHTML.trim()).toBe('Hello');

      globalRoleService.set('DUMMY');
      fixture.detectChanges();

      const div2 = queryElement(fixture, 'div');
      expect(div2.nativeElement.innerHTML.trim()).toBe('Not allowed');
    });
  });

  describe('Then + Else template rendering', () => {
    @Component({
      template: `
        <div *boostPermissions="'user.read'; then success; else fail">
          Hello
        </div>

        <ng-template #success>
          <div>
            I am allowed
          </div>
        </ng-template>

        <ng-template #fail>
          <div>
            Not allowed
          </div>
        </ng-template>
      `
    })
    class TestComp {

    }

    it('should render else template when there is no permission', () => {
      const fixture = createComponent(TestComp);
      globalRoleService.set('USER');
      fixture.detectChanges();

      const div1 = queryElement(fixture, 'div');
      expect(div1.nativeElement.innerHTML.trim()).toBe('I am allowed');

      globalRoleService.set('DUMMY');
      fixture.detectChanges();

      const div2 = queryElement(fixture, 'div');
      expect(div2.nativeElement.innerHTML.trim()).toBe('Not allowed');
    });
  });

});

function queryElement(
  fixture: ComponentFixture<any>,
  selector: string
) {
  return fixture.debugElement.query(By.css(selector));
}
