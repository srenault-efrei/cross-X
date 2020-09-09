import express from 'express'
import dotenv from 'dotenv'
import chalk from 'chalk'
import io, { Socket } from 'socket.io'
import randomWords from 'random-words'

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
let myRandomWords: string = randomWords()

const server = app.listen(port, () => {
  display(chalk.magenta(`crossPWAGame server is running on 0.0.0.0:${port}`))
})

const socketio = io(server)

let users: Array<User> = []
let round: number = 1

socketio.on('connection', (socket: Socket) => {
  console.log(randomNumber)
  console.log(myRandomWords)
  round = 1
  // CURRENT SOCKET/PLAYER

  display(chalk.cyan(`Connection opened for ( ${socket.id} )`))

  socket.on('disconnect', () => {

    if (users[0]?.nickname) {
      let currentUser = getUser(socket.id, users)
      console.log(currentUser)
      display(chalk.yellow(`Goodbye ${currentUser.nickname}`))
    }

    users = removeUser(socket.id, users)
    myRandomWords = randomWords()
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



  socket.on('magicNumber::sendScore', payload => {

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
    } else if (parseInt(score) === randomNumber) {
      display(chalk.red(`${currentUser.nickname} u find the good score`))
      position = "equal"
      users = removeUser(socket.id, users)
      currentUser["points"] = currentUser["points"] + 1
      round++
      users.push(currentUser)
      randomNumber = getRandomArbitrary(0, 1337)
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

  socket.on('QuickWord::sendWord', payload => {

    let currentUser = getUser(socket.id, users)
    const data = JSON.parse(payload)
    const { date } = data
    const { word } = data

    // if(word)



    socket.emit('QuickWord::resume', {
      // dateNow : new Date()
    })
  })




})
