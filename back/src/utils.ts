import moment from 'moment'

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




