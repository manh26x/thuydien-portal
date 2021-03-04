// This file can be replaced during build by using the `configuration=docker`.

/**
 * baseUrl: Api Host
 * basePath: Api Gateway context path
 * mediaUrl: Folder files on server
 * clientTimeout: client waiting api response time
 * importExportTimeout: client waiting api response time (Import, export feature)
 * logServer: Not Support now
 * logClient: Log console
 */
export const environment = {
  production: true,
  tokenEx: 43199,
  refreshTokenEx: 43199,
  clientId: 'YnJvd3NlcjoxMjM0',
  baseUrl: 'https://10.1.28.56:443',
  basePath: '',
  logServer: false,
  logClient: false,
  version: '2.3.1',
  mediaUrl: 'https://10.1.28.56/upload/',
  clientTimeout: 10000, // 10s
  importExportTimeout: 300000, // 5m
  idleTimeout: 1800
};
