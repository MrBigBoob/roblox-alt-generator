import randomUseragent from 'random-useragent';

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

/**
 * Generates a number between the two parameters
 */
function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Generates a random birthday
 */
function randomBirthday(): string {
  const randomDay = randomBetween(1, 28); // 28 incase february
  const randomMonth = months[Math.floor(Math.random() * months.length)];
  const randomYear = randomBetween(1923, new Date().getFullYear() - 14); // 1923 to (subtract 14 from current year)

  return `${randomDay} ${randomMonth} ${randomYear}`;
}

/**
 * Generates a random gender
 */
function randomGender(): number {
  return randomBetween(1, 2);
}

/**
 * Generate a random user agent
 * @deprecated Not in use
 */
function randomUserAgent(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const version = randomBetween(0, 9) + '.' + randomBetween(0, 9);

  let endStr = '';

  for (let i = 0; i < randomBetween(8, 13); i++) {
    endStr += chars[Math.floor(Math.random() * chars.length)];
  }

  endStr += '/' + version;

  return endStr;
}

const generateUseragent = () => randomUseragent.getRandom();

export { randomBirthday, randomGender, generateUseragent };
