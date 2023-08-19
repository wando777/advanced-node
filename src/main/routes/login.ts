import { type Router } from 'express'

export default (router: Router): void => {
  router.post('/api/login/facebook', (req, res) => {
    res.send({ data: 'any_data_test' })
  })
}
