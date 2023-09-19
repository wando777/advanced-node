import { AwsS3FileStorage } from './../../../../infra/gateways/aws-s3-file-storage'
import { env } from '@/main/config/env'

export const makeFileStorage = (): AwsS3FileStorage => {
  return new AwsS3FileStorage(
    env.s3.accessKey,
    env.s3.secret,
    env.s3.bucket
  )
}
