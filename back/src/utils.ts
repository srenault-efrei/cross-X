import moment from 'moment'

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

export const getOpponent = (id: string, users: Array<User>): User => {
  for (const user of users) {
    if (user.id !== id) {
      return user
    }
  }
}

export const getCurrentUser = (id: string, users: Array<User>): User => {
  for (const user of users) {
    if (user.id === id) {
      return user
    }
  }
}

export const removeUser = (id: string, users: Array<User>): Array<User> => {
  let result: Array<User> = []

  for (const user of users) {
    if (user.id !== id) {
      result.push(user)
    }
  }
  return result
}



export const fasterUser = (currentUser: User, opponent: User): User => {

  let result: User = {}

  if (currentUser.fasterUser === true && opponent.fasterUser === false) {
    result = currentUser
  } else if (opponent.fasterUser === true && currentUser.fasterUser === false) {
    result = opponent
  }

  return result
}

