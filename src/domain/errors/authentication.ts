export class AuthenticationError extends Error {
  constructor () {
    super('Authentication has been failed')
    this.name = 'AuthenticationError'
  }
}
