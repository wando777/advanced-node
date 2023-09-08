import { UserProfile } from '@/domain/entities'

describe('UserProfile', () => {
  let sut: UserProfile
  let id: string
  beforeEach(() => {
    jest.clearAllMocks()
    id = 'any_id'
    sut = new UserProfile(id)
  })
  it('should create it with empty initials when pictureUrl is provided', () => {
    sut.setPicture({ pictureUrl: 'any_url', name: 'any_name' })
    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: undefined
    })
  })
  it('should create it with empty initials when pictureUrl is provided', () => {
    sut.setPicture({ pictureUrl: 'any_url' })
    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: undefined
    })
  })
  it('should create initials with first letters from first and last name', () => {
    sut.setPicture({ name: 'wando h a leite' })
    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: 'WL'
    })
  })
  it('should create initials with first two letters from first name', () => {
    sut.setPicture({ name: 'wando' })
    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: 'WA'
    })
  })
  it('should create initials with first letter from first name', () => {
    sut.setPicture({ name: 'w' })
    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: 'W'
    })
  })
  it('should create it with empty initials when name and pictureUrl are not provided', () => {
    sut.setPicture({})
    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: undefined
    })
  })
})
