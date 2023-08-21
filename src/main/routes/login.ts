import { type Router } from 'express'
import { makeFacebookLoginController } from '../factories/application/controllers'
import { adaptExpressRoute as adapt } from '@/infra/gateways'

export default (router: Router): void => {
  router.post('/login/facebook', adapt(makeFacebookLoginController()))
}
