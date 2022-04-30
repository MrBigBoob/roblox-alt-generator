"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUseragent = exports.randomGender = exports.randomBirthday = void 0;
const random_useragent_1 = __importDefault(require("random-useragent"));
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
function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
/**
 * Generates a random birthday
 */
function randomBirthday() {
    const randomDay = randomBetween(1, 28); // 28 incase february
    const randomMonth = months[Math.floor(Math.random() * months.length)];
    const randomYear = randomBetween(1923, new Date().getFullYear() - 14); // 1923 to (subtract 14 from current year)
    return `${randomDay} ${randomMonth} ${randomYear}`;
}
exports.randomBirthday = randomBirthday;
/**
 * Generates a random gender
 */
function randomGender() {
    return randomBetween(1, 2);
}
exports.randomGender = randomGender;
/**
 * Generate a random user agent
 * @deprecated Not in use
 */
function randomUserAgent() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const version = randomBetween(0, 9) + '.' + randomBetween(0, 9);
    let endStr = '';
    for (let i = 0; i < randomBetween(8, 13); i++) {
        endStr += chars[Math.floor(Math.random() * chars.length)];
    }
    endStr += '/' + version;
    return endStr;
}
const generateUseragent = () => random_useragent_1.default.getRandom();
exports.generateUseragent = generateUseragent;
