import express from 'express'
import logger from 'morgan'
import WebSocket, { WebSocketServer } from 'ws'
import { createServer } from 'node:http'

const port = process.env.PORT ?? 3000

const app = express()

const server = createServer(app)
const wss = new WebSocketServer({ server })
const clients = []

wss.on('connection', function connection(ws) {
    clients.push(ws)
    console.log('Usuario conectado')

    ws.on('message', function incoming(data) {
        for (let client of clients) {
            client.send(data)
        }
    })

    ws.on('close', function close() {
        const socketIndex = clients.indexOf(ws)
        clients.splice(socketIndex, 1)
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
