export class ServerError extends Error {
  constructor(error?: Error) {
    super('The server has been returned an error')
    this.name = 'ServerError'
    this.stack = error?.stack
  }
}

export class UnauthorizedError extends Error {
  constructor() {
    super('The user is not authorized')
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends Error {
  constructor() {
    super('Access denied')
    this.name = 'ForbiddenError'
  }
}
