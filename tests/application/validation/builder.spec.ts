import { Required, Validator } from "@/application/validation"

describe('ValidationBuilder', () => {
  it('should return a Required validator', () => {
    const validators = ValidationBuilder.of({ value: 'any_value', fieldName: 'any_field_name' })
      .required().build()
    expect(validators).toEqual([new Required('any_value', 'any_field_name')])
  })
})

class ValidationBuilder {
  private constructor(
    private readonly value: string,
    private readonly fieldName: string,
    private readonly validators: Validator[] = []) { }

  static of(input: { value: string, fieldName: string }): ValidationBuilder {
    return new ValidationBuilder(input.value, input.fieldName)
  }

  required(): ValidationBuilder {
    this.validators.push(new Required(this.value, this.fieldName))
    return this
  }

  build(): Validator[] {
    return this.validators
  }
}
