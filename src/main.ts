/// <reference types="@angular/localize" />

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));

// Ensure document.title reflects environment
try {
  if (
    environment &&
    (environment as any).siteTitle &&
    typeof document !== 'undefined'
  ) {
    document.title = (environment as any).siteTitle as string;
  }
} catch {}
