// This file can be replaced during build by using the `configuration=docker`.

export const environment = {
  production: true,
  tokenEx: 43199,
  refreshTokenEx: 43199,
  clientId: 'YnJvd3NlcjoxMjM0',
  baseUrl: 'https://gateway-xplat-saleapp-dev.apps.dc-xplat-uat.nor.tpb.com',
  basePath: '',
  logServer: false,
  logClient: false,
  version: '2.5.1',
  mediaUrl: 'https://gateway-xplat-saleapp-dev.apps.dc-xplat-uat.nor.tpb.com/upload/',
  clientTimeout: 180000, // 3m
  importExportTimeout: 300000, // 5m
  idleTimeout: 18000,
  FirebaseConfig: {
    apiKey: 'AIzaSyDvOvMjAvaCnpNwu1T1bYS2O9TtrqFMBfA',
    authDomain: 'tpbank-salesapp.firebaseapp.com',
    projectId: 'tpbank-salesapp',
    storageBucket: 'tpbank-salesapp.appspot.com',
    messagingSenderId: '1079028932329',
    appId: '1:1079028932329:web:4d4154fa6b659ba976da78',
    measurementId: 'G-R8CWSMMC6S'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
