import { type MockProxy, mock } from 'jest-mock-extended'

describe('DbTransactionController', () => {
  let sut: DbTransactionController
  let db: MockProxy<DbTransaction>

  beforeAll(() => {
    db = mock()
  })
  beforeEach(() => {
    jest.clearAllMocks()
    sut = new DbTransactionController(db)
  })
  it('shoudld open transaction', async () => {
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
