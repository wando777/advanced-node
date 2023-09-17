import { InvalidMymeTypeError } from '@/application/errors'
import { AllowedMimeTypes } from '@/application/validation'

describe('AllowedMimeTypes', () => {
  it('should return InvalidMimeTypeError if value is invalid', () => {
    const sut = new AllowedMimeTypes(['png'], 'image/jpg')

    const result = sut.validate()

    expect(result).toEqual(new InvalidMymeTypeError(['png']))
  })
  it('should return undefined if value is valid', () => {
    const sut = new AllowedMimeTypes(['png'], 'image/png')

    const result = sut.validate()

    expect(result).toBeUndefined()
  })
  it('should return undefined if value is valid', () => {
    const sut = new AllowedMimeTypes(['jpg'], 'image/jpg')

    const result = sut.validate()

    expect(result).toBeUndefined()
  })
  it('should return undefined if value is valid', () => {
    const sut = new AllowedMimeTypes(['jpg'], 'image/jpeg')

    const result = sut.validate()

    expect(result).toBeUndefined()
  })
})
