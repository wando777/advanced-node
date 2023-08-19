import { FacebookApi } from '@/infra/apis'
import { makeAxiosHttpClient } from './http-client'
import env from '@/main/config/env'

export const makeFacebookApi = (): FacebookApi => {
  return new FacebookApi(
    makeAxiosHttpClient(),
    {
      client_id: env.facebookApi.clientId,
      client_secret: env.facebookApi.clientSecret
    }
  )
}
