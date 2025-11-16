import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PageInterface } from '../types/page.interface';

export const pageFeatureSelector = createFeatureSelector<PageInterface>('page');

export const botStatusSelector = createSelector(
  pageFeatureSelector,
  (pageState: PageInterface) => pageState.botStatus
);

export const apiKeysSelector = createSelector(
  pageFeatureSelector,
  (pageState: PageInterface) => pageState.userApi
);

export const loaderCountSelector = createSelector(
  pageFeatureSelector,
  (pageState: PageInterface) => pageState.loaderCount
);

export const reportsSelector = createSelector(
  pageFeatureSelector,
  (authState: PageInterface) => authState.reports
);

export const refInfoSelector = createSelector(
  pageFeatureSelector,
  (refInfoState: PageInterface) => refInfoState.refs
);
