import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import {SocketService} from '../../services/socket.service';
/*
  Generated class for the Main page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-main',
  templateUrl: 'main.html'

})
export class MainPage {
  @ViewChild(Slides) slides: Slides;
  model:string;
  date:any;
  msgs:any[]; 
  topmessage:string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public socket:SocketService) {
    this.msgs = []; 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MainPage');
   this.slides.lockSwipeToNext(true);
  }
   gotobar(num){
     this.slides.lockSwipeToNext(false);
     console.log(this.slides)
     this.slides.slideTo(num, 500);
     //this.reset()
      this.slides.lockSwipeToNext(true);
   }
     gotobar2(num, mm){
     this.slides.lockSwipeToNext(false);
     console.log(this.slides)
     this.slides.slideTo(num, 500);
     //this.reset()
      this.slides.lockSwipeToNext(true);
      this.socket.watchandmark(mm);
   }
   postmes(){
     if (this.model != ''){
     this.socket.sendmessage(this.model);
     this.msgs.push(this.model);
     let tdate = new Date();                //.toJSON().slice(0,10).replace(/-/g,'/');    
     this.date = tdate.toLocaleString();
     }     
     this.clear();
   }
   msg(m,n){
     this.topmessage = m;
     this.gotobar2(1, n)
   }
    clear(){
     this.model = '';
    
   }
}
