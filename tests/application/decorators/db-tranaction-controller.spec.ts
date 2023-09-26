import { type Controller } from '@/application/controllers'
import { type MockProxy, mock } from 'jest-mock-extended'

describe('DbTransactionController', () => {
  let sut: DbTransactionController
  let db: MockProxy<DbTransaction>
  let decoratee: MockProxy<Controller>

  beforeAll(() => {
    db = mock()
    decoratee = mock()
  })
  beforeEach(() => {
    jest.clearAllMocks()
    sut = new DbTransactionController(decoratee, db)
  })
  it('shoudld open transaction', async () => {
    await sut.perform({ any: 'any' })

    expect(db.openTransaction).toHaveBeenCalled()
  })
  it('shoudld calls our decoratee', async () => {
    await sut.perform({ any: 'any' })

    expect(decoratee.perform).toHaveBeenCalledWith({ any: 'any' })
    expect(decoratee.perform).toHaveBeenCalledTimes(1)
  })
  it('shoudld calls commit and close transaction on success', async () => {
    await sut.perform({ any: 'any' })

    expect(db.commit).toHaveBeenCalledWith()
    expect(db.commit).toHaveBeenCalledTimes(1)
    expect(db.closeTransaction).toHaveBeenCalledWith()
    expect(db.closeTransaction).toHaveBeenCalledTimes(1)
  })
})

class DbTransactionController {
  constructor(
    private readonly decoratee: Controller,
    private readonly db: DbTransaction
  ) { }

  async perform(httpRequest: any): Promise<void> {
    await this.db.openTransaction()
    await this.decoratee.perform(httpRequest)
    await this.db.commit()
    await this.db.closeTransaction()
  }
}

interface DbTransaction {
  openTransaction: () => Promise<void>
  closeTransaction: () => Promise<void>
  commit: () => Promise<void>
}
