import { type DbTransaction } from '@/application/contracts'
import { Controller } from '@/application/controllers'
import { DbTransactionController } from '@/application/decorators'
import { type MockProxy, mock } from 'jest-mock-extended'

describe('DbTransactionController', () => {
  let sut: DbTransactionController
  let db: MockProxy<DbTransaction>
  let decoratee: MockProxy<Controller>

  beforeAll(() => {
    db = mock()
    decoratee = mock()
    decoratee.perform.mockResolvedValue({ statusCode: 204, data: null })
  })
  beforeEach(() => {
    jest.clearAllMocks()
    sut = new DbTransactionController(decoratee, db)
  })
  it('should extend Controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
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
  it('shoudld rollback and close transaction on failure', async () => {
    decoratee.perform.mockRejectedValueOnce(new Error('decoratee_error'))

    await sut.perform({ any: 'any' }).catch(() => {
      expect(db.commit).not.toHaveBeenCalledWith()
      expect(db.rollback).toHaveBeenCalledWith()
      expect(db.rollback).toHaveBeenCalledTimes(1)
      expect(db.closeTransaction).toHaveBeenCalledWith()
      expect(db.closeTransaction).toHaveBeenCalledTimes(1)
    })
  })
  it('shoudld return same decoratee result on success', async () => {
    const result = await sut.perform({ any: 'any' })

    expect(result).toEqual({ statusCode: 204, data: null })
  })
  it('shoudld rethrow if decoratee throws', async () => {
    const error = new Error('decoratee_error')
    decoratee.perform.mockRejectedValueOnce(error)

    const promise = sut.perform({ any: 'any' })

    await expect(promise).rejects.toThrow(error)
  })
})
