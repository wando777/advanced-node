import { FacebookAccount } from '@/domain/models'

describe('', () => {
  const facebookDataMock = {
    facebookId: 'any_fb_id',
    name: 'any_fb_name',
    email: 'any_fb_email'
  }
  const userAccountDataMock = {
    userId: 'any_id',
    name: 'any_name',
    email: 'any_email'
  }
  it('should create an user with facebook data only', () => {
    const sut = new FacebookAccount(facebookDataMock)
    expect(sut).toEqual(facebookDataMock)
  })
  it('should update an user with facebook data', () => {
    const { name, ...userAccountDataMockWithoutName } = userAccountDataMock
    const newUserData = {
      userId: userAccountDataMockWithoutName.userId,
      ...facebookDataMock
    }
    const sut = new FacebookAccount(
      facebookDataMock,
      userAccountDataMockWithoutName
    )
    expect(sut).toEqual(newUserData)
  })
  it("should not update an user name with facebook data if it's not empy", () => {
    const newUserData = {
      ...facebookDataMock,
      ...{ userId: userAccountDataMock.userId, name: userAccountDataMock.name }
    }
    const sut = new FacebookAccount(facebookDataMock, userAccountDataMock)
    expect(sut).toEqual(newUserData)
  })
})
