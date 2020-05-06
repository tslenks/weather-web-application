/**
 *  The date provided by certains API is a timestamp in seconds
 *  The javascript handles date in milliseconds, so we need to convert the seconds in milliseconds
 *
 *
*/

/**
 * Convert the timestamp number to a specific date
 * @param {Number} timestampnumber
 * @param {Boolean} isMilliseconds used to convert the seconds in milliseconds if true provided
 */
function convertTimestampToDate(timestampnumber, sep = '/', isMilliseconds = false) {
  if (!isMilliseconds) {
    timestampnumber *= 1000;
  }

  const date = new Date(timestampnumber);
  const year = date.getFullYear();
  const month = (`0${date.getMonth()}`).substr(-2);
  const day = (`0${date.getDate()}`).substr(-2);
  const hour = (`0${date.getHours()}`).substr(-2);
  const minute = (`0${date.getMinutes()}`).substr(-2);
  const seconds = (`0${date.getSeconds()}`).substr(-2);

  return `${year + sep + month + sep + day} ${hour}:${minute}:${seconds}`;
}
