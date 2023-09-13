import { AwsS3FileStorage } from '@/infra/gateways'
import { S3, config } from 'aws-sdk'
import { mocked } from 'jest-mock'

jest.mock('aws-sdk')

describe('AwsS3FileStorage', () => {
  let accessKeyId: string
  let secretAccessKey: string
  let bucket: string
  let key: string
  let sut: AwsS3FileStorage
  beforeAll(() => {
    accessKeyId = 'any_id'
    secretAccessKey = 'any_secret'
    key = 'any_key'
    bucket = 'any_bucket'
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
  describe('UploadFile', () => {
    let file: Buffer
    let putObjectPromiseSpy: jest.Mock
    let putObjectSpy: jest.Mock
    beforeAll(() => {
      file = Buffer.from('any_buffer')
      putObjectPromiseSpy = jest.fn()
      putObjectSpy = jest.fn().mockImplementation(() => ({ promise: putObjectPromiseSpy }))
      mocked(S3).mockImplementation(jest.fn().mockImplementation(() => ({ putObject: putObjectSpy })))
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
  describe('DeleteFile', () => {
    let deleteObjectPromiseSpy: jest.Mock
    let deleteObjectSpy: jest.Mock

    beforeAll(() => {
      deleteObjectPromiseSpy = jest.fn()
      deleteObjectSpy = jest.fn().mockImplementation(() => ({ promise: deleteObjectPromiseSpy }))
      mocked(S3).mockImplementation(jest.fn().mockImplementation(() => ({ deleteObject: deleteObjectSpy })))
    })

    it('should call deleteObject with correct input', async () => {
      await sut.delete({ key })

      expect(deleteObjectSpy).toHaveBeenCalledWith({
        Bucket: bucket,
        Key: key
      })

      expect(deleteObjectSpy).toHaveBeenCalledTimes(1)
      expect(deleteObjectPromiseSpy).toHaveBeenCalledTimes(1)
    })
  })
})
