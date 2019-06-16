export interface Breadcrumb {
  text: string;
  path: string;
}

/**
 * Can't use this variable inside route definitions:
 * https://github.com/angular/angular-cli/issues/4686
 */
export const BREADCRUMBS_FIELD_NAME = 'breadcrumbs';
