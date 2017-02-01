import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { MainPage } from '../main/main';
import { NativeStorage} from 'ionic-native';
import {DataService} from '../../services/data.service';
import {Camera} from 'ionic-native';
import { Storage } from '@ionic/storage';
/*
  Generated class for the Signup page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
@ViewChild(Slides) slides: Slides;
  firstname:string;
  firstnameerr:string;
  imageerr:string;
  lastname:string;
  lastnameerr:string;
  frontpicture:boolean = false;
  public base64Image: string;
  sgnerr:string;
  address:string;
  addresserr:string;
  loadingfinal:boolean;
  nextofkinname:string;
 nextofkinnameerr:string;
regerr2:string;
  nextofkinnumber:string;
    nextofkinnumbererr:string;
  imagedata:any;
  
  loading:boolean = false;
  loadingpic:boolean = false;
  ssinloading:false;
  email:string;
  regerr:string;
  emailerr:string;
  telephone:string;
  telephoneerr:string;
  password:string;
  passworderr:string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public data: DataService, public storage: Storage) {

  }
  reset(){
    this.sgnerr = ''; this.firstname = '';  this.loadingfinal = false; this.imageerr = ''; this.address = ''; this.addresserr = ''; this.nextofkinnameerr = ''; this.nextofkinnumbererr = ''; this.nextofkinname = ''; this.nextofkinnumber = ''; this.loadingpic = false; this.regerr = ''; this.firstnameerr = ''; this.lastname = ''; this.ssinloading = false; this.lastnameerr = ''; this.email = ''; this.emailerr  = ''; this.loading = false; this.telephone = ''; this.telephoneerr = ''; this.password = ''; this.passworderr = '';
  }
  reseterr(){
    this.sgnerr = ''; this.firstnameerr = ''; this.loading = false; this.loadingfinal = false; this.imageerr = ''; this.loadingpic = false; this.regerr = "";  this.lastnameerr = ''; this.ssinloading = false;  this.emailerr  = '';  this.telephoneerr = '';  this.passworderr = ''; this.loading = false;
    this.addresserr = ''; this.nextofkinnameerr = ''; this.nextofkinnumbererr = '';
  }
signin(){
  this.reseterr();
  this.loading = true;
 if (this.telephone !== '' && this.password !== ''){
   this.data.signin(this.telephone, this.password)
   .then((dat)=>{
     if (dat){
       this.saveuser(this.telephone);
       this.navCtrl.push(MainPage);
     }else{
        console.log(dat); this.reseterr(); this.sgnerr = "Sorry we do not recognize those credentials";
     }
   })
   .catch((err)=>{console.log(err); this.reseterr; this.sgnerr = "Please contact Developer";})
 }
}
saveuser(username) :Promise<any>{
return new Promise(resolve=>{  
/*this.storage.get('userp')
  .then(data=>{

      console.log("exists");
      resolve(true);
  })
 .catch(err => {*/

 this.storage.set('userp', {account:username})
  
  .then(()=>{
    console.log('Stored item!'+username);
    resolve(true);
  })
  .catch( error =>{ console.log('Error storing item'+ error);
  resolve(false)
  });
    }
  );
//});
}
  furtherregister(){
    this.reseterr();
      if(this.address === ''){      
      this.addresserr = 'Address is required';
  
    }
   if(this.nextofkinname === ''){
      this.nextofkinnameerr = 'Name of next of Kin is required';
    
    }
   if(this.nextofkinnumber === ''){
      this.nextofkinnumbererr = 'Telephone Number of next of Kin is necessary';
  
    }
       if(! this.imagedata){
     this.imageerr  = 'Your Picture is required';
  
    }
    if (this.address !== '' && this.nextofkinname != '' &&this.nextofkinnumber !== '' && this.imagedata){  
       this.address = this.address.toLowerCase(); this.nextofkinname =  this.nextofkinname.toLowerCase(); this.nextofkinnumber =  this.nextofkinnumber.toLowerCase(); 
      this.loadingfinal = true;
       this.data.update(this.data.usermodel, {address:this.address, nextofkinname:this.nextofkinname,nextofkinnumber:this.nextofkinnumber, _id:this.data.objid})
       .then((output)=>{
         if (output.da == 'posted'){
             this.reseterr();
             this.data.updatepicture(this.imagedata, this.data.usermodel, this.data.objid)
          .then((output2)=>{
         if (output2.da == 'posted'){
             this.reseterr();           
             this.regerr2 = "Success";
             this.gotobar(0);
          }else{
           this.reseterr();
           this.regerr2 =  "Sorry can not post";
         }
         
       })
       .catch((err)=>{
          this.reseterr();
           this.regerr =  "Server error, contact administrator";
         console.log(err);
       });
             this.regerr2 = "Success";
             this.gotobar(2);
         }else{
           this.reseterr();
           this.regerr2 =  "Sorry this account exists in our Data base";
         }
         
       })
       .catch((err)=>{
          this.reseterr();
           this.regerr =  "Server error, contact administrator";
         console.log(err);
       });
    }else{
      return false;
    }

  }
  register(){
    this.reseterr();
    if(this.firstname === ''){      
      this.firstnameerr = 'First name is required';
  
    }
   if(this.lastname === ''){
      this.lastnameerr = 'Last name is required';
    
    }
   if(this.telephone === ''){
      this.telephoneerr = 'Telephone Number is required';
  
    }
   if(this.password === ''){
      this.passworderr = 'Password is required';
      
    }
    if (this.password !== '' && this.telephone != '' &&this.lastname !== '' && this.firstname !== ''){  
       this.password = this.password.toLowerCase(); this.firstname =  this.firstname.toLowerCase(); this.lastname =  this.lastname.toLowerCase(); this.email = this.email.toLowerCase();
      this.loading = true;
       this.data.signup({telephone:this.telephone, firstname:this.firstname, lastname:this.lastname, email:this.email, password:this.password, group:'public'})
       .then((output)=>{
         if (output.da == 'posted'){
             this.reseterr();
             this.regerr = "Success";
             this.gotobar(2);
         }else{
           this.reseterr();
           this.regerr =  "Sorry this account exists in our Data base";
         }
         
       })
       .catch((err)=>{
          this.reseterr();
           this.regerr =  "Server error, contact administrator";
         console.log(err);
       });
    }else{
      return false;
    }
  }
  
   gotobar(num){
     this.slides.lockSwipeToNext(false);
     console.log(this.slides)
     this.slides.slideTo(num, 500);
     this.reset()
      this.slides.lockSwipeToNext(true);
   }
 
  ionViewDidLoad() {
    this.reset();
    console.log('ionViewDidLoad SignupPage');
       this.slides.lockSwipeToNext(true);
  }


takePicture(where){
    let th = this;
    let st:any;
    if (where === 'cam'){
      st =  Camera.PictureSourceType.CAMERA;
    }
    else{
      st =  Camera.PictureSourceType.PHOTOLIBRARY;
    }
    th.loadingpic = true;
    Camera.getPicture({
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: st,
        quality:50,
        targetWidth: 300,
        allowEdit:false,
        correctOrientation:true,
        cameraDirection:1,
        targetHeight: 300
    }).then((imageData) => {
      // imageData is a base64 encoded string
        this.base64Image = "data:image/jpeg;base64," + imageData;
        this.imagedata = imageData;    
          
        let obj:any = {}  
        th.loadingpic   = false;    
        th.frontpicture= true;

       
    }, (err) => {
        console.log(err);
    });
  }
cancel(){
  this.base64Image = null;
  this.frontpicture = false;
  this.loadingpic = false;
}
 

}
