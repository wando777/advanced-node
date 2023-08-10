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
})

interface Validator {
  validate: () => Error | undefined
}

class ValidationComposite implements Validator {
  constructor(private readonly validators: Validator[]) { }
  validate(): Error | undefined {
    for (const element of this.validators) {
      const res = element.validate()
      if (res instanceof Error) {
        return res
      }
    }
    return undefined
  }
}
