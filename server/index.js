import express from 'express'
import logger from 'morgan'
import WebSocket, { WebSocketServer } from 'ws'
import { createServer } from 'node:http'

const port = process.env.PORT ?? 3000

const app = express()

const server = createServer(app)
const wss = new WebSocketServer({ server })

wss.on('connection', function connection(ws) {
    console.log('Usuario conectado')

    ws.on('message', function incoming(data) {
        ws.send(data.toString())
    })

    ws.on('close', function close() {
        console.log('Usuario desconectado')
    })
})

app.use(logger('dev'))
app.use(express.static(process.cwd() + '/client'))

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/client/index.html')
})

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})
