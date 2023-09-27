import { type DbTransaction } from '../contracts'
import { Controller } from '../controllers'
import { type HttpResponse } from '../helpers'

export class DbTransactionController extends Controller {
  constructor(
    private readonly decoratee: Controller,
    private readonly db: DbTransaction
  ) { super() }

  async perform(httpRequest: any): Promise<HttpResponse> {
    let response: HttpResponse
    await this.db.openTransaction()
    try {
      response = await this.decoratee.perform(httpRequest)
      await this.db.commit()
      return response
    } catch (err) {
      await this.db.rollback()
      throw err
    } finally {
      await this.db.closeTransaction()
    }
  }
}
