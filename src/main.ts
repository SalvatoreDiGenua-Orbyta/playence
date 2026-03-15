import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { environment } from './environments/environment';
import { makeServer } from './app/mirage/server';

if (environment.useMirage) {
  makeServer();
}

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
