import { FacebookLoginController } from '@/application/controllers'
import { makeFacebookAuthentication } from '../../domain/service'

export const makeFacebookLoginController = (): FacebookLoginController => {
  return new FacebookLoginController(makeFacebookAuthentication())
}
