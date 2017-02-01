import { Injectable } from '@angular/core';
import * as Leaflet from "leaflet";
//import '../../www/buid/js/leaflet-bing-layer'
import { Observable } from 'rxjs/Rx/';
import {Http, Headers} from '@angular/http';
import {EventEmitter} from '@angular/core';
import 'rxjs/add/operator/map';
declare var require: any;
declare let L: any;
declare let $:any;
let PouchDB = require('pouchdb');


@Injectable()
export class DataService {
static get parameters() {
    return [[Http]];
}
 headers: Headers;
 username: string = 'siberobinsion';
password: string = 'password';
remote:string;
adminusername:string;
adminpassword:string;
objid:string;
admingroup:string;
usermodel:string = 'nemausermodel';
remoteuser: any;
userid:string;
userrev:string;
localuser:any;
group: string;
 constructor(public http: Http) {
   this.headers  = new Headers();
   this.headers.append('Content-Type', 'application/json');
   this.headers.append('Authorization', 'Basic' + btoa('teryoutilatindinewarealr: 83386e7cde8577b728545b8f9731f4416e83ff58'));
   this.localuser = new PouchDB('users' /*{adapter: 'websql'}*/);
   this.remote = 'https://siberobinsion.cloudant.com'; 
   }
//usermodel
/*signup(usernamel, passwordl, firstnamel, lastnamel, groupl, emaill, telephonel, addressl):Promise<any>{
//username user's username
// password : users password
//group: level {public, admin, normalresponse}
let th = this;
return new Promise(resolve =>{
th.postdata({ _id: usernamel + passwordl, username: usernamel, firstname:firstnamel, lastname:lastnamel, password: passwordl, group:groupl, telephone:telephonel, address:addressl,email:emaill}, this.usermodel)
.then((dat) =>{
    resolve(dat);
})
.catch((err) => {
  console.log(err);
  resolve(false);
});
});
};*/
signup(obje):Promise<any>{
  obje.username = obje.telephone;
  obje._id = obje.username + obje.password;  
  this.objid =  obje._id;
//username user's username
// password : users password
//group: level {public, admin, normalresponse}
let th = this;
return new Promise(resolve =>{
th.postdata(obje, this.usermodel)
.then((dat) =>{
  if (!dat.response){
     resolve(false);
   }else{
    resolve(dat);
  }
})
.catch((err) => {
  console.log(err);
  resolve(false);
});
});
};
logout():Promise<any>{
  let th =this;
  return new Promise(resolve =>{
  th.adminusername = null;
  th.adminusername = null;
  th.admingroup = null;  
  th.localuser.allDocs().then(function (result) {
  return Promise.all(result.rows.map(function (row) {  
  return th.localuser.remove(row.id, row.value.rev);
  }));
}).then(function () {
   console.log('Successfully deleted db');
   resolve(true)
}).catch(function (err) {
   console.log(err);
   resolve(false);
});
  });
}
checklogin():Promise<any>{
let th = this;
return new Promise(resolve =>{
  th.localuser.get('username', {include_docs:true}).then((doc)=>{
   th.signin(doc.username, doc.password)
   .then((res)=>{
     resolve(res)
   }).catch((err) => {console.log(err); resolve(false); })
    }).catch((err) => {console.log(err); resolve(false);})
  });
}
updatepicture(img, dbname,_id):Promise<any>{
  return new Promise(resolve =>{
    this.getdata(_id, this.usermodel)
    .then((dat)=>{
      if (! dat){
        resolve(false);
      } else {
   this.putattachmenthack(dat._id, 'picture',dat._rev, img)
   .then((data)=>{
       if (data && data.da === "posted") {
           resolve(data);
         }else{
         resolve(false);
         };
   }).catch((err)=>{console.log(err);  resolve(false); });  
      }
    });
  });
}
update( dbname, obj):Promise<any>{
  let th = this;
  return new Promise(resolve =>{
    this.getdata(obj._id, this.usermodel)
    .then((dat)=>{
      if (! dat){
        resolve(false);
      } else {
		 let ult = Object.assign(obj, dat);        
       let data = JSON.stringify(ult);
      let remote = this.remote +'/' + dbname +'/' + obj._id;      
      let  headers = this.headers; 
    th.http.put(remote, data, {headers:headers})
     .map(res => res.json())
      .subscribe(
       (data) => {
         let val = this.dosuccess(data);
         console.log(val);
         resolve({response:val, da:'posted'});
         },
      (err) =>{ this.doerror(err)
        console.log(err);
        resolve({response: false, da:'notposted'});  
      },
      () => console.log('Post Complete')
    ); 
        }
    });
  });
}
signin(username,password):Promise<any>{
return new Promise(resolve =>{


let options =  { retry: true,  attachments:true,  auth: { username: this.username, password: this.password } }
let pouch = new PouchDB(this.remote + '/'+this.usermodel, options);
pouch.get(username + password, {include_docs:true})
 //this.getdata(username + password, this.usermodel)
 .then((dat)=>{
   if (dat){
      resolve(true)
      /*this.putdoc(dat,this.localuser)
      .then((dt)=>{
        if (dt) {
          this.userid = dt.id;
          this.userrev = dt.rev;
          this.adminusername = dt.username;
          this.adminpassword = dt.password;
          this.admingroup = dt.group;
          resolve(true);
        }else{
          resolve(false);
        }
      }).catch((err) => {
        console.log(err);
       resolve(false);
         });
    }else{
     resolve(false);*/
   } else{
     resolve(false);
   }
 }).catch((err) => {
   console.log(err);
   resolve(false);
  });
});
}
//get data from cloudant
//
getdata(_id, dbname): Promise<any> {
return new Promise(resolve =>{
 let th = this;
  let  headers = th.headers; 
  let remote = this.remote + '/' + dbname + '/'+_id;
  th.http.get(remote, {headers:headers})
     .map(res => res.json())
      .subscribe(
       (data) => {
         let val = this.dosuccessget(data);
         if (val){
           resolve(data);
         }else{
         resolve(false);
         };
         },
      (err) =>{ this.doerror(err)
      resolve(false);
      },
      () => console.log('Post Complete')
    );
    })
}

dosuccessget(data){
if (data._id){
return true;
}else{
  return false;
}
}
// cloudant Implementation
doerrorget(data){
console.log(data);
return false;
}


// post data into cludant
// three possible obj response {response:boolean, da:exists, or posted, or notposted}
postdata(obj, dbname): Promise<any> {
return new Promise(resolve =>{ 
 let th = this;
 th.getdata(obj._id, dbname)
 .then((dat)=>{
   if (dat){
     resolve({response:false, da: 'exists'});
   }
  }) .catch((err)=>{ 

       });
  let  headers = th.headers;
  let data = JSON.stringify(obj);
  let remote = this.remote +'/' + dbname;
  console.log(remote);
  th.http.post(remote, data, {headers:headers})
     .map(res => res.json())
      .subscribe(
       (data) => {
         let val = this.dosuccess(data);
         console.log(val);
         resolve({response:val, da:'posted'});
         },
      (err) =>{ this.doerror(err)
        console.log(err);
        resolve({response: false, da:'notposted'});  
      },
      () => console.log('Post Complete')
    );
 
    })

}
dosuccess(data){
if (data.ok){
return true;
};
}
//cloudant Implementation
doerror(data){
console.log(data);
return false;
}

//Pouchdb Implementation
//put documents into pouchdb
//inputs db:db name , doc:object or json to be added to the db
//type promise: returns a status object if successful or returns a fail object if failed  
updatedocs(doc, db):Promise<any>{
return new Promise(resolve=>{
  db.put(doc).then((response)=>{
    if (response.ok){
      resolve({'stat':true, 'id':response.id, 'rev':response.rev})
    }
    else{
      resolve(false)
    }
  })
 .catch((err)=>{
   console.log(err);
  })

  });
};
putdoc(doc, db):Promise<any>{
return new Promise(resolve=>{  
  db.put(doc).then((response)=>{
    if (response.ok){
      resolve({'stat':true, 'id':response.id, 'rev':response.rev})
    }
    else{
      resolve(false)
    }
    
  })
 .catch((err)=>{
   console.log(err);
  })
  })
};


putdocs(doc, db):Promise<any>{
return new Promise(resolve=>{
  db.get(doc._id).then((dd)=>{   
    console.log(dd);
    
    resolve({'stat': true, 'id': dd._id, 'rev': dd._rev}) 
  }).catch((err)=>{console.log(err)
  db.put(doc).then((response)=>{
    if (response.ok){
      resolve({'stat': true, 'id': response.id, 'rev': response.rev})      
    }
    else{
      resolve(false)
    }
    
  })
 .catch((err)=>{
   console.log(err);
  })
  })
  });
};

//Pouchdb Implementation
//put attachment into pouchdb
//inputs db:db name , id:id of the document to put, imgid the id of the iage to put , rev, the rev of the document to update , image the base64 rep of the iage to upload
//type promise: returns a status object if successful or returns a fail object if failed  

putattachment(id,db, imgid,rev, image){ 

 return new Promise(resolve=>{
db.putAttachment(id, imgid,rev, image, 'image/jpg').then(function (response) {
     if (response.ok){
      resolve({'stat':true, 'id':response.id, 'rev':response.rev})      
    }
    else{
      resolve(false)
    }
}).catch(function (err) {
  console.log(err);
});
});
}
putattachmenthack(id, imgid,rev, image):Promise<any>{   
let options =  { retry: true,  attachments:true,  auth: { username: this.username, password: this.password } }
let pouch = new PouchDB(this.remote + '/'+this.usermodel, options);
return new Promise(resolve=>{
pouch.putAttachment(id, 'picture', rev, image, 'image/jpeg').then(function (response) {
     if (response.ok){
      resolve({da:'posted', response:true})      
    }
    else{
      resolve(false)
    }
}).catch(function (err) {
  console.log(err);
   resolve(false)
});
});
}

removeattachment(id,db, imgid,rev){ 
 return new Promise(resolve=>{
db.removeAttachment(id, imgid,rev).then(function (response) {
     if (response.ok){
      resolve({'stat':true, 'id':response.id, 'rev':response.rev})      
    }
    else{
      resolve(false)
    }
}).catch(function (err) {
  console.log(err);
});
});
}






getattachment(id,db, imagename){ 
 return new Promise(resolve=>{
db.getAttachment(id, imagename).then(function (blob) {
let url = URL.createObjectURL(blob);
resolve(url);
}).catch(function (err) {
  console.log(err);
  resolve(false);
});
});
}

handleChange(change, db, listoutput){
let th = this;
let changedDoc = null;
let changedIndex = null;
try{
    listoutput.forEach((doc, index) => { 
      if(doc._id === change.id){
        changedDoc = doc;
        changedIndex = index;
      }
       });
    } catch(err){
      console.log(err);
    } 
    //A document was deleted
    if(change.deleted){
     listoutput.splice(changedIndex, 1);
    } 
    else { 
      //A document was updated
      if(changedDoc){
        console.log(changedDoc);
       db.getAttachment(changedDoc._id, changedDoc._id + 'picture').then(function (blob) {
       let url = URL.createObjectURL(blob); 
       changedDoc.imageurl = url;
              }).catch(function (err) {
        console.log(err);
        });
         listoutput.splice(changedIndex, 1);
         listoutput.push(changedDoc) ;

      }
}
}






} //end of data class