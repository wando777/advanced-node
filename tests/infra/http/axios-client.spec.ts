import { type HttpGetClient } from '@/data/infra/gateways'
import axios from 'axios'

jest.mock('axios')

describe('AxiosttpClient', () => {
  describe('GET', () => {
    let sut: AxiosHttpClient
    let anyInput: HttpGetClient.Input
    beforeAll(() => {
      anyInput = {
        url: 'any',
        params: {
          foo: 'any'
        }
      }
    })
    beforeEach(() => {
      sut = new AxiosHttpClient()
    })
    it('Should call get with correct params', async () => {
      const fakeAxios = axios as jest.Mocked<typeof axios>

      await sut.get(anyInput)

      expect(fakeAxios.get).toHaveBeenCalledWith(anyInput.url, { params: anyInput.params })
      expect(fakeAxios.get).toHaveBeenCalledTimes(1)
    })
  })
})

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class AxiosHttpClient {
  async get(input: HttpGetClient.Input): Promise<void> {
    await axios.get(input.url, { params: input.params })
    // return await new Promise(resolve => { resolve(response.data) })
  }
}
