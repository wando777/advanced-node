import { Required } from "./required"
import { Validator } from "./validation"

export class ValidationBuilder {
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
