export class ApiErrorResponse extends Error {
  constructor(
    public code: string,
    public message: string) {
    super(message);
    Object.setPrototypeOf(this, ApiErrorResponse.prototype);
  }
}

export class ApiErrorTokenInvalid extends Error {
  constructor(public code: string, public message: string) {
    super(message);
    Object.setPrototypeOf(this, ApiErrorTokenInvalid.prototype);
  }
}

export class ApiErrorForbidden extends Error {
  constructor(public code: string, public message: string) {
    super(message);
    Object.setPrototypeOf(this, ApiErrorForbidden.prototype);
  }
}

export class ApiErrorArgsInvalid extends Error {
  constructor(
    public code: string,
    public message: string,
    public params: any) {
    super(message);
    Object.setPrototypeOf(this, ApiErrorArgsInvalid.prototype);
  }
}

export class ApiErrorGetUserInfo extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ApiErrorGetUserInfo.prototype);
  }
}
