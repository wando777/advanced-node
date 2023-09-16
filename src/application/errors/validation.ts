export class RequiredFieldError extends Error {
  constructor(fieldName?: string) {
    super(`The field ${fieldName ?? ''} is required`)
    this.name = 'RequiredFieldError'
  }
}

export class InvalidMymeTypeError extends Error {
  /* eslint-disable @typescript-eslint/restrict-template-expressions */
  constructor(allowed: string[]) {
    super(`Allowed types: ${allowed}`)
    this.name = 'InvalidMymeTypeError'
  }
}

export class MaxFileSizeError extends Error {
  constructor(maxSizeInMb: number) {
    super(`File upload limit is ${maxSizeInMb}mb`)
    this.name = 'MaxFileSizeError'
  }
}
