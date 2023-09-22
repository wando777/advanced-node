/* eslint-disable @typescript-eslint/no-extraneous-class */

describe('PgConnection', () => {
  it('should have only one instance (Singleton)', () => {
    const sut = PgConnection.getInstance()
    const sut2 = PgConnection.getInstance()

    expect(sut).toBe(sut2)
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
}
