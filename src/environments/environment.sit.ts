// This file can be replaced during build by using the `configuration=docker`.

/**
 * baseUrl: Api Host
 * basePath: Api Gateway context path
 * mediaUrl: Folder files on server
 * clientTimeout: client waiting api response time - Removed at commit 19e66d48
 * importExportTimeout: client waiting api response time (Import, export feature) - Removed at commit 19e66d48
 * logServer: Not Support now
 * logClient: Log console
 */
export const environment = {
  production: true,
  tokenEx: 43199,
  refreshTokenEx: 43199,
  clientId: 'YnJvd3NlcjoxMjM0',
  baseUrl: 'https://gateway-xplat-saleapp-sit.apps.dc-xplat-uat.nor.tpb.com',
  basePath: '',
  logServer: false,
  logClient: false,
  version: '2.5.1',
  mediaUrl: 'https://gateway-xplat-saleapp-sit.apps.dc-xplat-uat.nor.tpb.com/upload/',
  clientTimeout: 180000, // 3m
  importExportTimeout: 300000, // 5m
  idleTimeout: 1800,
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
