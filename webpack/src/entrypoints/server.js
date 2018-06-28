// express server

import express from 'express'
import morgan from 'morgan'
import render from './serverRender'

const PORT = process.env.NODE_PORT || 9000

const handleRender = (req, res) => {
  const actions = req.body
  const url = req.url
  const result = render(url, actions)
  res.json({ url, ...result })
}

const app = express()
app.use(express.json({ limit: '10mb' }))
app.set('json spaces', 2)
app.use(morgan('combined'))
app.get(/\.ico$/, (req, res) => res.status(404).send())
app.use(handleRender)
app.listen(PORT, () => console.log(`listening on port ${PORT}`))
