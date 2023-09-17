import { MaxFileSizeError } from '../errors'
import { type Validator } from './validation'

export class MaxFileSize implements Validator {
  constructor(
    private readonly maxSizeInMb: number,
    private readonly value: Buffer
  ) { }

  validate(): Error | undefined {
    const maxSizeInBytes = this.maxSizeInMb * 1024 * 1024
    if (this.value.length > maxSizeInBytes) {
      return new MaxFileSizeError(this.maxSizeInMb)
    }
  }
}
