/* eslint-disable @typescript-eslint/no-extraneous-class */
import { createConnection, getConnectionManager } from 'typeorm'
import { mocked } from 'jest-mock'

jest.mock('typeorm', () => ({
  Entity: jest.fn(),
  PrimaryGeneratedColumn: jest.fn(),
  Column: jest.fn(),
  createConnection: jest.fn(),
  getConnectionManager: jest.fn()
}))

describe('PgConnection', () => {
  let sut: PgConnection
  let getConnectionManagerSpy
  let createQueryRunnerSpy: jest.Mock
  let createConnectionSpy: jest.Mock

  beforeAll(() => {
    getConnectionManagerSpy = jest.fn().mockReturnValue({
      has: jest.fn().mockReturnValueOnce(false)
    })
    mocked(getConnectionManager).mockImplementation(getConnectionManagerSpy)
    createQueryRunnerSpy = jest.fn()
    createConnectionSpy = jest.fn().mockResolvedValue({
      createQueryRunner: createQueryRunnerSpy
    })
    mocked(createConnection).mockImplementation(createConnectionSpy)
  })
  beforeEach(() => {
    jest.clearAllMocks()
    sut = PgConnection.getInstance()
  })
  it('should have only one instance (Singleton)', () => {
    const sut2 = PgConnection.getInstance()

    expect(sut).toBe(sut2)
  })
  it('should create a new connection', async () => {
    const sut = PgConnection.getInstance()

    await sut.connect()

    expect(createConnectionSpy).toHaveBeenCalledWith()
    expect(createConnectionSpy).toHaveBeenCalledTimes(1)
    expect(createQueryRunnerSpy).toHaveBeenCalledWith()
    expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1)
  })
})

class PgConnection {
  private static instance: PgConnection

  private constructor() { }

  static getInstance(): PgConnection {
    if (PgConnection.instance === undefined) {
      PgConnection.instance = new PgConnection()
    }
    return PgConnection.instance
  }

  async connect(): Promise<void> {
    const connection = await createConnection()
    connection.createQueryRunner()
  }
}
