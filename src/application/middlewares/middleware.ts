import { type HttpResponse } from '../helpers'

export interface Middleware {
  handle: (HttpRequest: any) => Promise<HttpResponse>
}
