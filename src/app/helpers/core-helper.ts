export class CoreHelper {
  toBoolean(value?: string): boolean {
    if (!value) {
      return false;
    }

    switch (value.toLocaleLowerCase()) {
      case 'true':
      case '1':
      case 'on':
      case 'yes':
        return true;
      default:
        return false;
    }
  }

  isRunningAsApp(): boolean {
    let userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf(' electron/') > -1) {
      return true;
    }

    return false;
  }
}
