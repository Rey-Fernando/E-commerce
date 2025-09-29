import app from './app.js'
import { appConfig } from './config/env.js'
import { connectDatabase } from './config/database.js'

const bootstrap = async () => {
  try {
    await connectDatabase()

    app.listen(appConfig.port, () => {
      console.log(`?? Servidor escuchando en http://localhost:${appConfig.port}`)
    })
  } catch (error) {
    console.error('Error iniciando el servidor', error)
    process.exit(1)
  }
}

bootstrap()
