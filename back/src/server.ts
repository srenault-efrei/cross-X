import express from 'express'
import dotenv from 'dotenv'
import chalk from 'chalk'
import io, { Socket } from 'socket.io'

import { isNull, display, getRandomArbitrary, getUser, removeUser } from './utils'

interface User {
  id?: string
  nickname?: string
  points?: number
}

// prelude -- loading environment variable
dotenv.config()
if (isNull(process.env.PORT)) {
  throw 'Sorry missing PORT env'
}

const port = parseInt(process.env.PORT)
const app = express()
let randomNumber: number = getRandomArbitrary(0, 1337)

const server = app.listen(port, () => {
  display(chalk.magenta(`crossPWAGame server is running on 0.0.0.0:${port}`))
})

const socketio = io(server)

let users: Array<User> = []
let round: number = 1

socketio.on('connection', (socket: Socket) => {
  console.log(randomNumber)
  round = 1
  // CURRENT SOCKET/PLAYER

  display(chalk.cyan(`Connection opened for ( ${socket.id} )`))

  socket.on('disconnect', () => {

    if (users[0]?.nickname) {
      const { nickname } = users[0]
      display(chalk.yellow(`Goodbye ${nickname}`))
    }
    users = removeUser(socket.id, users)

    display(chalk.cyan(`Connection closed for ( ${socket.id} )`))
  })

  socket.on('game::sendNickname', payload => {
    const user = JSON.parse(payload)
    const { nickname } = user
    display(chalk.yellow(`Here comes a new challenger : ${nickname} ( from ${socket.id} )`))

    users.push({ id: socket.id, nickname, points: 0 })
    console.log(users)

    socket.emit('game::start', {
      howManyPlayers: users.length,
    })
  })



  socket.on('game::sendScore', payload => {

    let currentUser = getUser(socket.id, users)
    let position = "less"
    const data = JSON.parse(payload)
    const { score } = data
    

    display(chalk.green(`${currentUser.nickname} indicate the number : ${score}`))
    if (parseInt(score) < randomNumber) {
      display(chalk.red(`${currentUser.nickname} it's more`))
      position = "more"
    } else if (parseInt(score) > randomNumber) {
      display(chalk.red(`${currentUser.nickname} it's less`))
    } else if ( parseInt(score) === randomNumber) {
      display(chalk.red(`${currentUser.nickname} u find the good score`))
      position = "equal"
      users = removeUser(socket.id, users)
      currentUser["points"] = currentUser["points"] + 1
      round ++
      users.push(currentUser)
      randomNumber = getRandomArbitrary(0,1337)
      console.log(users)
      console.log(randomNumber)
    }

    socket.emit('magicNumber::resume', {
      position,
      currentUser,
      users,
      round

    })
  })




})
