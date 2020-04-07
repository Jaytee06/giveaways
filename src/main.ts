import {enableProdMode} from '@angular/core';
import {environment} from './environments/environment';

if (environment.production) {
  enableProdMode();
} else {
  $(".prod-only").remove();
}

import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {TCGAppModule} from './app/app.module';

platformBrowserDynamic().bootstrapModule(TCGAppModule);



