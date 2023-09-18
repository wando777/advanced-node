import { AwsS3FileStorage } from '@/infra/gateways'
import { env } from '@/main/config/env'
import axios from 'axios'

describe('AWS S3 integration tests', () => {
  let sut: AwsS3FileStorage

  beforeEach(() => {
    sut = new AwsS3FileStorage(
      env.s3.accessKey,
      env.s3.secret,
      env.s3.bucket
    )
  })
  it('should return a Facebook User if token is valid', async () => {
    const onePixelImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+M/A8B8ABQAB/6Zcm10AAAAASUVORK5CYII='
    const file = Buffer.from(onePixelImage, 'base64')
    const key = 'any_file_name.png'
    const pictureUrl = await sut.upload({ key, file })

    expect((await axios.get(pictureUrl)).status).toBe(200)

    await sut.delete({ key })

    await expect(axios.get(pictureUrl)).rejects.toThrow()
  })
})
