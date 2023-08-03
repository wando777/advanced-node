import { AxiosHttpClient, type HttpGetClient } from '@/data/infra/gateways'
import axios from 'axios'

jest.mock('axios')

describe('AxiosttpClient', () => {
  describe('GET', () => {
    let sut: AxiosHttpClient
    let anyInput: HttpGetClient.Input
    let fakeAxios: jest.Mocked<typeof axios>
    let returnGetMock: any
    beforeAll(() => {
      returnGetMock = { status: 200, data: 'any_data' }
      fakeAxios = axios as jest.Mocked<typeof axios>
      fakeAxios.get.mockResolvedValue(returnGetMock)
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
      await sut.get(anyInput)
      expect(fakeAxios.get).toHaveBeenCalledWith(anyInput.url, { params: anyInput.params })
      expect(fakeAxios.get).toHaveBeenCalledTimes(1)
    })
    it('Should return data on get success', async () => {
      const res = await sut.get(anyInput)
      expect(res).toEqual(returnGetMock.data)
    })
    it('Should rethrown if get throws', async () => {
      fakeAxios.get.mockRejectedValueOnce(new Error('http_error'))
      const promise = sut.get(anyInput)
      await expect(promise).rejects.toThrow(new Error('http_error'))
    })
  })
})
