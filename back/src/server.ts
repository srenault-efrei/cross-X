import express from 'express'
import dotenv from 'dotenv'
import chalk from 'chalk'
import io, { Socket } from 'socket.io'

import {
  display
} from './utils'

import path from 'path'


dotenv.config()


const port = parseInt(process.env.PORT)
const app = express()

// app.use(express.static(path.join(__dirname, "../public")));

const server = app.listen(port, () => {
  display(chalk.magenta(`cross X  server is running on 0.0.0.0:${port}`))
})

const socketio = io(server)


socketio.on('connection', (client: Socket) => {
  display(chalk.cyan(`Connection opened for ( ${client.id} )`))

  client.on('join_room', (data) => {
    console.log('join room ' + data)
    client.join(data)
  })

  client.on('quit_room', (data) => {
    client.leave(data)
  })

  client.on('send_message', (data) => {
    client.to(data.room).emit('receive_message', data)
  })

  client.on('start_call', (data) => { })

  client.on('disconnect', () => {
    // display(chalk.cyan(`Connection closed for ( ${client.id} )`))
  })
})


