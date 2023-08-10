import { ValidationComposite, type Validator } from '@/application/validation'
import { type MockProxy, mock } from 'jest-mock-extended'

describe('ValidationComposite', () => {
  let sut: ValidationComposite
  let validator1: MockProxy<Validator>
  let validator2: MockProxy<Validator>
  let validators: Validator[]
  beforeAll(() => {
    validator1 = mock()
    validator1.validate.mockReturnValue(undefined)
    validator2 = mock()
    validator2.validate.mockReturnValue(undefined)
    validators = [validator1, validator2]
  })
  beforeEach(() => {
    sut = new ValidationComposite(validators)
  })
  it('should return undefined if all Validators return undefined', () => {
    const validations = sut.validate()

    expect(validations).toBeUndefined()
  })
  it('should return the first error', () => {
    validator1.validate.mockReturnValueOnce(new Error('error_1'))
    validator2.validate.mockReturnValueOnce(new Error('error_2'))

    const validations = sut.validate()

    expect(validations).toEqual(new Error('error_1'))
  })
  it('should return the error found', () => {
    validator2.validate.mockReturnValueOnce(new Error('error_2'))

    const validations = sut.validate()

    expect(validations).toEqual(new Error('error_2'))
  })
})
