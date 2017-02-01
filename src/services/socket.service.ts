import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {App} from "ionic-angular/index";
import {Events} from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import {models} from '../models/model';
import { NavController, ModalController } from 'ionic-angular';
import {Storage, SqlStorage} from 'ionic';
import { Network } from 'ionic-native';
import * as io from "socket.io-client";
import { NativeStorage} from 'ionic-native';
declare var require: any;
declare var cordova: any;

//let io = require('socket.io')(http);
@Injectable()
export class SocketService {
socketService:any;
socketObserver:any;
socket:any;
public phone:number; public id:number
lat:number;
lng:number;
usersonline:any[];
watch:any;
usersonlinedata:number;
messagefromclient:any[] = [];
constructor() {
this.socketService = Observable.create(observer => {
this.socketObserver = observer; 

 });
this.socket = io.connect('https://nema-koler.herokuapp.com/', {reconnect: true}); 
//this.login();

   } // constructor


  watchandmark(mm){    
    let th = this;
    th.watch.subscribe(data=>{
    this.lat = data.coords.latitude;
    this.lng = data.coords.longitude;
    console.log('watch lat '+data.coords.latitude+'watch long '+data.coords.longitude);
     let tdate = new Date();   
     let date = tdate.toLocaleString();
    this.postmessage({lat:this.lat, lng:this.lng, msg:'', time:tdate, localtime:date, about:mm},this.id);   
  },erro=>{
      console.log(erro);
  });
   
  }//watchandmark
sendmessage(message){
  
    let tdate = new Date();   
     let date = tdate.toLocaleString();
     this.postmessage({lat:this.lat, lng:this.lng, msg:message, time:tdate, localtime:date, about:''},this.id);
   
}
login(){ 
console.log(this.id+ " this is ur contact number"); 
this.socket.emit('login', {id: this.id, phone:this.phone});
}//login information in socket service

 initialize(peer_phone):Promise<any>{
this.watch = Geolocation.watchPosition({enableHighAccuracy:false, timeout:12000})
 let th = this;
  return new Promise(resolve=>{
   th.socket.on('connect', function(socket){
     console.log("Connected to soket"); 
     th.login();       
   });
  th.socket.on('currentusers',function(data){    
    console.log(data); 
    console.log('data from koler');   
    th.usersonline = data.length;
    th.usersonlinedata = data;
    //console.log(data);
    console.log(th.usersonline);
    console.log(th.usersonlinedata);
     console.log('data from users');
  });
  this.socket.on('postsent', function(data){
   th.onPost(data ); 

  }); 
    this.socket.on('disconnect',function(data){
    console.log('userleft')
  });
  this.socket.on('login', function(data){ 
     this.socketObserver.next(()=>{
       console.log("logged in");
  });
  });   
   resolve(true);
     });
    
 }//initialize

postmessage(message, id):Promise<any>{
  return new Promise(resolve=>{
  let th = this;
  message.id = id;
  th.socket.emit('sendpost', { 'message':message});
  });
}
onPost(data){
//alert('posted');
   this.messagefromclient.push(data);
   console.log( this.messagefromclient)
   console.log('messages sent')
}

  }//xocketSerfvice Class
