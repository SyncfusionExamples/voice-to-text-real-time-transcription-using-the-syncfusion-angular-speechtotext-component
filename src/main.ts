import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { registerLicense } from '@syncfusion/ej2-base';
registerLicense('ORg4AjUWIQA/Gnt2XFhhQlJHfVtdX2dWfFN0QHNedVt0flFCcC0sT3RfQFhjTX9Udk1mWX5Wcn1dT2teWA==');


bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
