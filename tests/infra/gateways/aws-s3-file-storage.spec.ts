import { type UploadFile } from '@/domain/contracts/gateways'
import { S3, config } from 'aws-sdk'
import { mocked } from 'jest-mock'

jest.mock('aws-sdk')

describe('AwsS3FileStorage', () => {
  let accessKeyId = 'any_id'
  let secretAccessKey = 'any_secret'
  let key: string
  let file: Buffer
  let bucket: string
  let sut: AwsS3FileStorage
  let putObjectPromiseSpy: jest.Mock
  let putObjectSpy: jest.Mock
  beforeAll(() => {
    accessKeyId = 'any_id'
    secretAccessKey = 'any_secret'
    key = 'any_key'
    file = Buffer.from('any_buffer')
    bucket = 'any_bucket'
    putObjectPromiseSpy = jest.fn()
    putObjectSpy = jest.fn().mockImplementation(() => ({ promise: putObjectPromiseSpy }))
    mocked(S3).mockImplementation(jest.fn().mockImplementation(() => ({ putObject: putObjectSpy })))
  })
  beforeEach(() => {
    sut = new AwsS3FileStorage(accessKeyId, secretAccessKey, bucket)
  })
  it('should config aws credentials on creation', () => {
    expect(sut).toBeDefined()
    expect(config.update).toHaveBeenCalledWith({
      credentials: {
        accessKeyId,
        secretAccessKey
      }
    })
    expect(config.update).toHaveBeenCalledTimes(1)
  })
  it('should call put object with correct inputs', async () => {
    await sut.upload({ key, file })

    expect(putObjectSpy).toHaveBeenCalledWith({
      Bucket: bucket,
      Key: key,
      Body: file,
      ACL: 'public-read'
    })
    expect(putObjectSpy).toHaveBeenCalledTimes(1)
    expect(putObjectPromiseSpy).toHaveBeenCalledTimes(1)
  })
  it('should return imageUrl', async () => {
    const url = `https://${bucket}.s3.amazonaws.com/${key}`

    const imageUrl = await sut.upload({ key, file })

    expect(imageUrl).toBe(url)
  })
  it('should return encoded imageUrl', async () => {
    const url = `https://${bucket}.s3.amazonaws.com/${encodeURIComponent('any key')}`

    const imageUrl = await sut.upload({ key: 'any key', file })

    expect(imageUrl).toBe(url)
  })
  it('should rethrow if putObject throws', async () => {
    const error = new Error('upload_error')
    putObjectPromiseSpy.mockRejectedValueOnce(error)

    const promise = sut.upload({ key, file })

    await expect(promise).rejects.toThrow()
  })
})

export class AwsS3FileStorage implements UploadFile {
  constructor(accessKeyId: string, secretAccessKey: string, private readonly bucket: string) {
    config.update({
      credentials: {
        accessKeyId,
        secretAccessKey
      }
    })
  }

  async upload({ file, key }: UploadFile.Input): Promise<UploadFile.Output> {
    await new S3().putObject({
      Bucket: this.bucket,
      Key: key,
      Body: file,
      ACL: 'public-read'
    }).promise()
    return `https://${this.bucket}.s3.amazonaws.com/${encodeURIComponent(key)}`
  }
}
