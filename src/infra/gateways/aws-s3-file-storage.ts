import { type DeleteFile, type UploadFile } from '@/domain/contracts/gateways'
import { config, S3 } from 'aws-sdk'

export class AwsS3FileStorage implements UploadFile, DeleteFile {
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

  async delete(input: { key: string }): Promise<void> {

  }
}
