import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { StatusBar, Splashscreen } from 'ionic-native';
import { SignupPage } from '../pages/signup/signup';
import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ListPage } from '../pages/list/list';
import { Slides } from 'ionic-angular';
import {DataService} from '../services/data.service';
import {SocketService} from '../services/socket.service';
import { MainPage } from '../pages/main/main';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
 // rootPage: any =SignupPage;
 // rootPage:any = MainPage;  /*development*/
  rootPage:any; /*deployment*/
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
     public storage: Storage,
     public socket:SocketService
  
  ) {
    this.initializeApp();
    // set our app's pages
  
    this.pages = [
      { title: 'Hello Ionic', component: HelloIonicPage },
      { title: 'My First List', component: ListPage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      StatusBar.styleDefault();
      Splashscreen.hide();
      /************ .............*/
        this.storage.get('userp')
       .then(data=>{
        console.log(data);
       this.rootPage  =MainPage;    
       this.nav.setRoot(MainPage);   
        this.socket.id = data.account;
        this.socket.phone = data.account;
        this.socket.initialize(data.account);

       })
    .catch((err) => {
    console.log(err);
   this.rootPage = SignupPage;
    this.nav.setRoot(SignupPage); 
   
 });
         /*.........................................deployment */
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}
