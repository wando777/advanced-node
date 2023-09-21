import { type Router } from 'express'
import { auth } from '../middlewares'
import { makeSavePictureController } from '../factories/application/controllers'
import { adaptExpressRoute as adapt, adaptMulter as multer } from '../adapters'

export default (router: Router): void => {
  router.delete('/users/picture', auth, adapt(makeSavePictureController()))
  router.put('/users/picture', auth, multer, adapt(makeSavePictureController()))
}
