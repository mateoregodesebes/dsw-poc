import express from 'express'
import { Server } from 'socket.io'
import { createServer } from 'http'
import logger from 'morgan'
import mqtt from 'mqtt'

const app = express()
const server = createServer(app);
const io = new Server(server, {
    connectionStateRecovery: {}
  })

io.on('connection', async (socket) => {
    console.log('a user has connected!')
  
    socket.on('disconnect', () => {
      console.log('a user has disconnected')
    })

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg)
    })
})

app.use(logger('dev'))

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/client/index.html')
})

app.use(express.static(process.cwd() + '/browser_side'))

//mqtt:
const mqttClient = mqtt.connect('mqtt://test.mosquitto.org', { port: 1883 })

mqttClient.on('connect', () => {
    mqttClient.subscribe('chat/notifications', (err) => {
        if (!err) {
            console.log('Suscrito al topic chat/notifications')
        } else {
            console.error('Error al suscribirse al topic:', err)
        }
    })
})

mqttClient.on('message', (topic, message) => {
    console.log(`Notificación recibida: ${message.toString()}`)
})

server.listen(3000, () => {
    console.log('server running at 8080')
})










