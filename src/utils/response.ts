export default class Response {
  public constructor(
    private code: number,
    private message: string,
    private data?: any
  ) {}

  public getCode(): number {
    return this.code;
  }

  public getMessage(): string {
    return this.message;
  }

  public getData(): any {
    return this.data;
  }
}
