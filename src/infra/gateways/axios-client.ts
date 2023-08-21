import axios from 'axios'
import { type HttpGetClient } from './client'

export class AxiosHttpClient implements HttpGetClient {
  async get<T = any>({ url, params }: HttpGetClient.Input): Promise<T> {
    const response = await axios.get(url, { params })
    return response.data
  }
}
