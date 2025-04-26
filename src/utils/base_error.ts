export class BaseError extends Error {
    status: number;
    errors: any;
  
    constructor(status: number, message: string, errors?: any) {
      super(message);
      this.status = status;
      this.errors = errors;
      Object.setPrototypeOf(this, BaseError.prototype);
    }
  
    static BadRequest(message: string, errors?: any) {
      return new BaseError(400, message, errors);
    }
  
    static Unauthorized(message: string = "Unauthorized") {
      return new BaseError(401, message);
    }
  
    static Forbidden(message: string = "Forbidden") {
      return new BaseError(403, message);
    }
  
    static NotFound(message: string = "Not Found") {
      return new BaseError(404, message);
    }
  }
  