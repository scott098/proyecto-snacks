import { SidebarPage } from './../pages/sidebar/sidebar';
import { LoginPage } from './../pages/login/login';
import { AuthProvider } from './../providers/auth/auth';
import { Component } from '@angular/core';
import { Platform, LoadingController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { OneSignal } from '@ionic-native/onesignal';
@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  rootPage:any;
  rootPageParams:any;
  token: any;
  constructor(private storage: Storage, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private auth:AuthProvider, public loadingCtrl: LoadingController, private onesignal: OneSignal) {
    this.hasToken().then(data=>{
      if(this.isTokenValid()){
        this.rootPage= SidebarPage;
        this.rootPageParams = {tipo_usuario: "Cliente" }
      }
      else{
        this.rootPage = LoginPage;
      }
      statusBar.hide();
      splashScreen.hide();
    },(error) => {
      this.rootPage = LoginPage;
      statusBar.hide();
      splashScreen.hide();
    })
    .catch(e=>{
      this.rootPage=LoginPage;
      statusBar.hide();
      splashScreen.hide();
    });
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      // OneSignal Code start:
      // Enable to debug issues:

      if(platform.is('core') || platform.is('mobileweb')) {
        console.log("Platform is core or is mobile web");
      } else {
        var notificationOpenedCallback = function(jsonData) {
          console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
        };

        window["plugins"].OneSignal
          .startInit("9ba5748e-6561-4bdf-8c4c-77d4766fbde8", "108844902326")
          .handleNotificationOpened(notificationOpenedCallback)
          .endInit(); 
      }
    });
  }

  /**
   * Checa si existe el token en el storage
  **/
  hasToken(){
    return this.storage.get('id_token').then(data=>{
      if(data){
        this.token = data;
      }
      else{
        this.token = undefined;
      }
    });
  }

  isTokenValid(){
    if(this.token !== undefined){
      return this.auth.getUserDataByToken(this.token).subscribe(
        (success)=>{console.log(success.json());},
        (error)=>{return false;},
      );
    }
  }

}

