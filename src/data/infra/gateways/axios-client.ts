import axios from 'axios'
import { type HttpGetClient } from './client'

export class AxiosHttpClient implements HttpGetClient {
  async get<T = any>(input: HttpGetClient.Input): Promise<T> {
    const response = await axios.get(input.url, { params: input.params })
    return response.data
  }
}
