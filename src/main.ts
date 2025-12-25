import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { setLogLevel, LogLevel } from '@angular/fire';

setLogLevel(LogLevel.VERBOSE);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
