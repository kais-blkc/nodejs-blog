export class HttpException extends Error {
  constructor(
    public readonly status: number,
    public readonly message: string,
    public readonly details?: object,
  ) {
    super(message);
    Object.setPrototypeOf(this, HttpException.prototype);
  }

  public toJson() {
    return {
      status: this.status,
      message: this.message,
      ...(this.details && { details: this.details }),
    };
  }
}
