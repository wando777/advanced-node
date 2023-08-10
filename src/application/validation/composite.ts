import { type Validator } from './validation'

export class ValidationComposite implements Validator {
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
