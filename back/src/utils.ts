import moment from 'moment'
const fs = require('fs')
import chalk from 'chalk'


interface User {
  id?: string
  nickname?: string
  points?: number
  fasterUser?: boolean
}

/**
 * @function isNotNull
 * @description check if all args are not null
 *
 * @param {unknown[]} values - any arguments to checks
 * @return {boolean}
 *
 * @example
 * isNotNull(x, y, z, process.env.PORT)
 *
 */
export const isNotNull = (...values: unknown[]): boolean => {
  for (const v of values) {
    if (v === undefined || v === null) {
      return false
    }
  }
  return true
}

/**
 * @function isNull
 * @description check if all args are null
 *
 * @param {unknown[]} values - any arguments to checks
 * @return {boolean}
 *
 * @example
 * isNull(x, y, z, process.env.PORT)
 *
 */
export const isNull = (...values: unknown[]): boolean => !isNotNull(...values)

/**
 * @function display
 * @description display on output with time
 *
 * @param {string} str - data to display
 * @return {void}
 *
 * @example
 * display("Il a pas dit bonjour")
 *
 */
export const display = (str: string): void => console.log(`[${moment()}] ${str}`)

/**
 * @function getRandomArbitrary
 * @description return a random number 
 *
 * @param {number} min  - minimal number
 * @param {number} max  - maximal number
 * @return {number}
 *
 * @example
 * getRandomArbitrary(0,1337)
 *
 */

export const getRandomArbitrary = (min: number, max: number): number => {
  return Math.floor(Math.random() * Math.floor(max - min) + min);

}

/**
 * @function getOpponent
 * @description return the opponent of the game 
 *
 * @param {string} id - socketId of the currentUser
 * @param {Array<User>} users - table with game users
 * @return {user}
 *
 * @example
 * getOpponent('12121', [{id:12121, name:Steven, points: 0 ,fasterUser: false},{id:333232Dss, name: heliote, points: 0,fasterUser: false}])
 *
 */

export const getOpponent = (id: string, users: Array<User>): User => {
  for (const user of users) {
    if (user.id !== id) {
      return user
    }
  }
}

/**
 * @function getCurrentUser
 * @description return the current User 
 *
 * @param {string} id - socketId of the currentUser
 * @param {Array<User>} users - table with game users
 * @return {user}
 *
 * @example
 * getCurrentUser('333232Dss', [{id:12121, name:Steven, points: 0, fasterUser: false},{id:333232Dss, name: heliote, points: 0 ,fasterUser: false}])
 *
 */

export const getCurrentUser = (id: string, users: Array<User>): User => {
  for (const user of users) {
    if (user.id === id) {
      return user
    }
  }
}


/**
 * @function removeUser
 * @description remove the user of the game table
 *
 * @param {string} id - socketId of the user u want remove
 * @param {Array<User>} users - table with game users
 * @return {Array<User>}
 *
 * @example
 * removeUser('333232Dss', [{id:12121, name:Steven, points: 0 ,fasterUser: false},{id:333232Dss, name: heliote, points: 0 ,fasterUser: false}])
 *
 */


export const removeUser = (id: string, users: Array<User>): Array<User> => {
  let result: Array<User> = []

  for (const user of users) {
    if (user.id !== id) {
      result.push(user)
    }
  }
  return result
}



/**
 * @function fasterUser
 * @description define the fastest user
 *
 * @param {User} currentUser - the currentUser of the game
 * @param {User} opponent - the opponent of the game
 * @return {User}
 *
 * @example
 * fasterUser({id:12121, name:Steven, points: 0 ,fasterUser: false}, {id:333232Dss, name: heliote, points: 0 ,fasterUser: false})
 *
 */

export const fasterUser = (currentUser: User, opponent: User): User => {

  let result: User = {}

  if (currentUser.fasterUser === true && opponent.fasterUser === false) {
    result = currentUser
  } else if (opponent.fasterUser === true && currentUser.fasterUser === false) {
    result = opponent
  }

  return result
}



let data = {}
let tabQuickWord = []
let tabMagicNumber = []


/**
 * @function saveGame
 * @description save the data of each game
 *
 * @param {string} game - the current game
 * @param { Array<User>} users - table of players
 * @param {Date} beginDate - begin date of the game 
 * @param {Date} endDate - end date of the game

 * @return {void}
 *
 * @example
 * saveGame('QuickWord', [{id:12121, name:Steven, points: 0 ,fasterUser: false},{id:333232Dss, name: heliote, points: 0 ,fasterUser: false}],
 *  2020-09-11T03:27:53.697Z, 2020-09-11T03:28:57.095Z)
 *
 */

export const saveGame = (game: string, users: Array<User>, beginDate: Date, endDate: Date) => {
  let newFile: string = "game.json"

  let objectGame = {}

  objectGame["beg"] = beginDate
  objectGame["end"] = endDate
  objectGame["players"] = users

  if (game === 'QuickWord') {
    tabQuickWord.push(objectGame)
    data[game] = tabQuickWord
  } else {
    tabMagicNumber.push(objectGame)
    data[game] = tabMagicNumber

  }

  let dataStringify = JSON.stringify(data, null, 4)

  fs.writeFile(newFile, dataStringify, (err: object) => {
    if (err) throw err;
  });

  display(chalk.green('File `' + newFile + '` has been successfully created'))
}


/**
 * @function removeKeyFasterUser
 * @description remove the properties fasterUser in the table of players
 *
 * @param {Array<User>} users - table of players
 * @param {User} opponent - the opponent of the game
 * @return {Array<User>}
 *
 * @example
 * removeKeyFasterUser({id:12121, name:Steven, points: 0 ,fasterUser: false}, {id:333232Dss, name: heliote, points: 0 ,fasterUser: false})
 *
 */


export const removeKeyFasterUser = (users: Array<User>): Array<User> => {

  for (const user of users) {
    delete user.fasterUser
  }
  return users
}