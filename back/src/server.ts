import express from 'express'
import dotenv from 'dotenv'
import chalk from 'chalk'
import io, { Socket } from 'socket.io'
import randomWord from 'random-words'

import {
  isNull, display, getRandomArbitrary, getCurrentUser, removeUser, getOpponent, fasterUser, saveGame, removeKeyFasterUser
} from './utils'

interface User {
  id?: string
  nickname?: string
  points?: number
  fasterUser?: boolean
}



// prelude -- loading environment variable
dotenv.config()
if (isNull(process.env.PORT)) {
  throw 'Sorry missing PORT env'
}

const port = parseInt(process.env.PORT)
const app = express()
let randomNumber: number = getRandomArbitrary(0, 1337)
let myRandomWord: string = randomWord()

const server = app.listen(port, () => {
  display(chalk.magenta(`crossPWAGame server is running on 0.0.0.0:${port}`))
})

const socketio = io(server)

let users: Array<User> = []
let round: number = 1
let beginDate: Date
let endDate: Date

socketio.on('connection', (socket: Socket) => {

  display(chalk.blue(`le nombre aléatoire est : ${randomNumber}\n`))
  display(chalk.blue(`le mot aléatoire est : ${myRandomWord}\n`))

  round = 1
  // CURRENT SOCKET/PLAYER

  display(chalk.cyan(`Connection opened for ( ${socket.id} )`))

  socket.on('disconnect', () => {

    // if (users[0].nickname !== undefined) {
    //   let currentUser = getUser(socket.id, users)
    //   console.log(currentUser)
    //   display(chalk.yellow(`Goodbye ${currentUser.nickname}`))
    // }

    users = removeUser(socket.id, users)
    myRandomWord = randomWord()
    display(chalk.cyan(`Connection closed for ( ${socket.id} )`))
  })

  // ADD NEW USER WITH NAME

  socket.on('game::sendNickname', payload => {
    const user = JSON.parse(payload)
    const { nickname } = user
    display(chalk.yellow(`Here comes a new challenger : ${nickname} ( from ${socket.id} )`))

    users.push({ id: socket.id, nickname, points: 0, fasterUser: false })
    console.log(users)
    if (users.length === 2) {
      beginDate = new Date()
    }

    // socket.emit('game::start', {
    //   howManyPlayers: users.length,
    // })
  })

  // socket.on('game::howManyPlayers', playload => {
  //   let currentUser = getCurrentUser(socket.id, users)

  //   socket.emit('game::players', {
  //     users,
  //     currentUser,
  //     players: users.length
  //   })
  // })



  //  MAGICNUMBER SENDSCORE

  socket.on('magicNumber::sendScore', payload => {

    let currentUser = getCurrentUser(socket.id, users)
    let opponent: User = getOpponent(socket.id, users)
    let position: string = "less"
    const data = JSON.parse(payload)
    const { score } = data


    display(chalk.green(`${currentUser.nickname} indicate the number : ${score}`))
    if (parseInt(score) < randomNumber) {
      display(chalk.red(`${currentUser.nickname} it's more`))
      position = "more"
    } else if (parseInt(score) > randomNumber) {
      display(chalk.red(`${currentUser.nickname} it's less`))
    } else if (parseInt(score) === randomNumber) {
      display(chalk.green(`${currentUser.nickname} u find the good score`))
      position = "equal"
      users = removeUser(socket.id, users)
      currentUser["points"] = currentUser["points"] + 1
      round++
      users.push(currentUser)
      randomNumber = getRandomArbitrary(0, 1337)
      console.log(users)
      display(chalk.blue(`le nombre aléatoire est : ${randomNumber}\n`))
    } else if (score === '' || typeof score === 'string') {
      position = "notNumber"
    }

    if (currentUser.points === 3 || opponent.points === 3) {
      endDate = new Date()
      saveGame("magicNumber", removeKeyFasterUser(users), beginDate, endDate)
    }

    socket.emit('magicNumber::resume', {
      position,
      currentUser,
      users,
      round

    })
  })
  // EVENT RANDOM WORD
  socket.on('QuickWord::randomWord', playload => {

    socket.emit('Quickword::word', {
      myRandomWord,
    })
  })

  // QUICKWORD SENDWORD

  socket.on('QuickWord::sendWord', payload => {

    let currentUser = getCurrentUser(socket.id, users)
    let message: string = 'found'
    const data = JSON.parse(payload)
    const { word } = data
    let winner: User = {}
    let opponent: User = getOpponent(socket.id, users)

    if (word === myRandomWord) {
      users = removeUser(socket.id, users)
      if (opponent.fasterUser !== true) {
        currentUser["fasterUser"] = true
      }

      users.push(currentUser)
      winner = fasterUser(currentUser, opponent)
      if (winner.id === currentUser.id) {
        display(chalk.green(`${winner.nickname} u found the word the fastest `))
        myRandomWord = randomWord()
        users = removeUser(socket.id, users)
        currentUser["points"] = currentUser["points"] + 3
        users.push(currentUser)
        console.log(users)
        display(chalk.blue(`le mot aléatoire est : ${myRandomWord}\n`))
        users = removeUser(socket.id, users)
        currentUser["fasterUser"] = false
        users.push(currentUser)
        message = 'faster'
        round++
      }

    } else if (word !== myRandomWord) {
      display(chalk.red(`${word} it's not the good word`))
      message = 'not found'
    }
    if (currentUser.points === 15 || opponent.points === 15) {
      endDate = new Date()
      saveGame("QuickWord", removeKeyFasterUser(users), beginDate, endDate)
    }

    socket.emit('QuickWord::resume', {

      message,
      currentUser,
      users,
      round,
      myRandomWord
    })
  })




})
