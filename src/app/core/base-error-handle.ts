export class BaseErrorHandle {
  getHttpStatusCode(error: any) {
    if (!navigator.onLine) {
      return 'noInternet';
    }
    return error.status;
  }

  getClientMessage(error: Error): string {
    if (!navigator.onLine) {
      return 'No Internet Connection';
    }
    return error.message ? error.message : error.toString();
  }

  getClientStack(error: Error): string {
    return error.stack;
  }

  sendLogToServer(err: any): void {
    // TODO: write service sendlog
  }
}
