import { PermissionsDirective } from './permissions.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoostPermissionsModule } from '../boost-permissions.module';
import { BoostPermissionsService } from '../_services/boost-permissions.service';
import { Component, Type } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('PermissionsDirective', () => {
  let permissionsService: BoostPermissionsService;

  function createComponent<T>(component: Type<T>) {
    TestBed.configureTestingModule({
      declarations: [
        component
      ],
      imports: [
        BoostPermissionsModule
      ]
    });

    permissionsService = TestBed.get(BoostPermissionsService);

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
      permissions = 'user.create';
    }

    it('should not show a template when permissions hasn\'t been initialized', () => {
      const fixture = createComponent(TestComp);
      fixture.detectChanges();

      const div = queryElement(fixture, 'div');
      expect(div).toBeFalsy();
    });

    it('should toggle views when user permissions change', () => {
      const fixture = createComponent(TestComp);
      permissionsService.loadPermissions('user.create');
      fixture.detectChanges();

      const div1 = queryElement(fixture, 'div');
      expect(div1).toBeDefined();

      permissionsService.removePermissions('user.create');
      fixture.detectChanges();

      const div2 = queryElement(fixture, 'div');
      expect(div2).toBeFalsy();
    });

    it('should toggle views when required permissions change', () => {
      const fixture = createComponent(TestComp);
      permissionsService.loadPermissions('user.create');
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
        <div *boostPermissions="'user.create'; then success">
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
      permissionsService.loadPermissions('user.create');
      fixture.detectChanges();

      const div1 = queryElement(fixture, 'div');
      expect(div1.nativeElement.innerHTML.trim()).toBe('I am allowed');

      permissionsService.removePermissions('user.create');
      fixture.detectChanges();

      const div2 = queryElement(fixture, 'div');
      expect(div2).toBeFalsy();
    });
  });

  describe('Else template rendering', () => {
    @Component({
      template: `
        <div *boostPermissions="'user.create'; else fail">
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
      permissionsService.loadPermissions('user.create');
      fixture.detectChanges();

      const div1 = queryElement(fixture, 'div');
      expect(div1.nativeElement.innerHTML.trim()).toBe('Hello');

      permissionsService.removePermissions('user.create');
      fixture.detectChanges();

      const div2 = queryElement(fixture, 'div');
      expect(div2.nativeElement.innerHTML.trim()).toBe('Not allowed');
    });
  });

  describe('Then + Else template rendering', () => {
    @Component({
      template: `
        <div *boostPermissions="'user.create'; then success; else fail">
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
      permissionsService.loadPermissions('user.create');
      fixture.detectChanges();

      const div1 = queryElement(fixture, 'div');
      expect(div1.nativeElement.innerHTML.trim()).toBe('I am allowed');

      permissionsService.removePermissions('user.create');
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
