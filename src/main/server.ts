import './config/module-alias'
import { app } from './config/app'
import env from './config/env'
import 'reflect-metadata'

app.listen(env.port, () => {
  console.log(`Server running at http://localhost:${env.port}`)
})
