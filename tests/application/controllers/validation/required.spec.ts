import { RequiredFieldError } from '@/application/errors'
import { Required } from '@/application/validation'

describe('Required', () => {
  it('should return RequiredFieldError if value is empty', () => {
    const sut = new Required('', 'any_field_name')

    const result = sut.validate()

    expect(result).toEqual(new RequiredFieldError('any_field_name'))
  })
  it('should return RequiredFieldError if value is null', () => {
    const sut = new Required(null as any, 'any_field_name')

    const result = sut.validate()

    expect(result).toEqual(new RequiredFieldError('any_field_name'))
  })
  it('should return RequiredFieldError if value is undefined', () => {
    const sut = new Required(undefined as any, 'any_field_name')

    const result = sut.validate()

    expect(result).toEqual(new RequiredFieldError('any_field_name'))
  })
  it('should return undefined if value is not empty', () => {
    const sut = new Required('any_value', 'any_field_name')

    const result = sut.validate()

    expect(result).toBeUndefined()
  })
})
