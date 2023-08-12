import { Required, ValidationBuilder } from '@/application/validation'

describe('ValidationBuilder', () => {
  it('should return a Required validator', () => {
    const validators = ValidationBuilder.of({ value: 'any_value', fieldName: 'any_field_name' })
      .required().build()
    expect(validators).toEqual([new Required('any_value', 'any_field_name')])
  })
})
