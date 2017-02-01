import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Safe } from  '../models/pipe';
import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';
import { MainPage } from '../pages/main/main';
import { SignupPage } from '../pages/signup/signup';
import { Slides } from 'ionic-angular';
import {DataService} from '../services/data.service';
import {SocketService} from '../services/socket.service';
import { Storage } from '@ionic/storage';
@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    SignupPage,
    Safe,
    MainPage

  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    SignupPage,
    MainPage
  ],
  providers: [{provide: ErrorHandler,  useClass: IonicErrorHandler},DataService, SocketService, Storage]
})
export class AppModule {}
