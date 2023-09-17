import { InvalidMymeTypeError } from '../errors'
import { type Validator } from './validation'

type Extension = 'png' | 'jpg'

export class AllowedMimeTypes implements Validator {
  constructor(
    private readonly allowed: Extension[],
    private readonly mimeType: string
  ) { }

  validate(): Error | undefined {
    if (this.isPng() || this.isJpg()) {
      return undefined
    }
    return new InvalidMymeTypeError(this.allowed)
  }

  private isPng(): boolean {
    return (this.allowed.includes('png') && this.mimeType === 'image/png')
  }

  private isJpg(): boolean {
    return (this.allowed.includes('jpg') && /image\/jpe?g/.test(this.mimeType))
  }
}
