import { DbTransactionController } from '@/application/decorators'
import { makePgConnection } from '../../infra/repos/postgres/helpers'
import { type Controller } from '@/application/controllers'

export const makePgTransactionController = (controller: Controller): DbTransactionController => {
  return new DbTransactionController(controller, makePgConnection())
}
