export class ServerError extends Error {
  constructor(error?: Error) {
    super('The server has been returned an error')
    this.name = 'ServerError'
    this.stack = error?.stack
  }
}
