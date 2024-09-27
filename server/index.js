import express from 'express'
import { Server } from 'socket.io'
import { createServer } from 'http'
import logger from 'morgan'

const port = process.env.PORT ?? 8080

const app = express()
const server = createServer(app);
const io = new Server(server, {
    connectionStateRecovery: {}
  })

io.on('connection', async (socket) => {
    console.log('a user has connected!')
  
    socket.on('disconnect', () => {
      console.log('an user has disconnected')
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

server.listen(8080, () => {
    console.log('server running at 8080')
})















