import { MaxFileSizeError } from '@/application/errors'
import { MaxFileSize } from '@/application/validation'

describe('MaxFileSize', () => {
  it('should return MaxFileSizeError if value is invalid', () => {
    const invalidBuffer = Buffer.from(new ArrayBuffer(6 * 1024 * 1024))
    const sut = new MaxFileSize(5, invalidBuffer)

    const result = sut.validate()

    expect(result).toEqual(new MaxFileSizeError(5))
  })
  it('should return undefined if value is invalid', () => {
    const valid = Buffer.from(new ArrayBuffer(4 * 1024 * 1024))
    const sut = new MaxFileSize(5, valid)

    const result = sut.validate()

    expect(result).toBeUndefined()
  })
  it('should return undefined if value is invalid', () => {
    const valid = Buffer.from(new ArrayBuffer(5 * 1024 * 1024))
    const sut = new MaxFileSize(5, valid)

    const result = sut.validate()

    expect(result).toBeUndefined()
  })
})
