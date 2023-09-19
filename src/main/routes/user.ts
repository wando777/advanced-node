import { type Router } from 'express'
import { auth } from '../middlewares'

export default (router: Router): void => {
  router.delete('/users/picture', auth)
}
