import { RequiredFieldError } from '../errors'

export class Required {
  constructor(private readonly value: string,
    private readonly fieldName: string
  ) { }

  validate(): Error | undefined {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!this.value || Object.keys(this.value).length === 0) {
      return new RequiredFieldError(this.fieldName)
    }
  }
}
