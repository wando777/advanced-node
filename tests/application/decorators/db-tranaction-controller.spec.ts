import { mock } from 'jest-mock-extended'

describe('DbTransactionController', () => {
  it('shoudld open transaction', async () => {
    const db = mock<DbTransaction>()
    const sut = new DbTransactionController(db)

    await sut.perform({ any: 'any' })

    expect(db.openTransaction).toHaveBeenCalled()
  })
})

class DbTransactionController {
  constructor(private readonly db: DbTransaction) { }
  async perform(httpRequest: any): Promise<void> {
    await this.db.openTransaction()
  }
}

interface DbTransaction {
  openTransaction: () => Promise<void>
}
