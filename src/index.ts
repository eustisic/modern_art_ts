import express from "express"
import 'dotenv/config'
import type { Application } from "express"
import handlers from "./handlers"
import logger from "./logger"

const app: Application = express()

const PORT: number = 5000

app.get('/', (_, res) => {
  res.send('Hello, world!')
})

app.post('/prompt', (req, res) => {
  handlers.promptHandler(req, res)
})

app.listen(PORT, () => {
  logger.log('info', `Server is running at http://localhost:${PORT}/`)
})