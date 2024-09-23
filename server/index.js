import express from 'express'
import logger from 'morgan'
import WebSocket, { WebSocketServer } from 'ws'
import { createServer } from 'node:http'
import mqtt from 'mqtt'


const port = process.env.PORT ?? 3000

const app = express()

const server = createServer(app)
const wss = new WebSocketServer({ server })
const clients = []


const mqttClient = mqtt.connect('mqtt://test.mosquitto.org')


mqttClient.on('connect', () => {
    mqttClient.subscribe('chat/notifications', (err) => {
       if (!err) {
          console.log('Suscrito al topic chat/notifications')
       }
    })
 })


mqttClient.on('message', (topic, message) => {
    console.log(`Notificación recibida: ${message.toString()}`)
    for (let client of clients) {
       client.send(`🔔 Notificación: ${message.toString()}`)
    }
 })


wss.on('connection', function connection(ws) {
    clients.push(ws)
    console.log('Usuario conectado')

    ws.on('message', function incoming(data) {
        for (let client of clients) {
            client.send(data)
        }

        mqttClient.publish('chat/notifications', 'Nuevo mensaje en el chat')
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
