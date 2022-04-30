"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectorType = exports.DBUtil = void 0;
const MySQLConnector_1 = __importDefault(require("./connector/MySQLConnector"));
const VeduConnector_1 = __importDefault(require("./connector/VeduConnector"));
let DBUtil;
exports.DBUtil = DBUtil;
let connectorType;
exports.connectorType = connectorType;
switch (process.env.DB_TYPE) {
    case 'mysql':
        exports.DBUtil = DBUtil = new MySQLConnector_1.default();
        exports.connectorType = connectorType = 'mysql';
        break;
    case 'vedu':
    default:
        exports.DBUtil = DBUtil = new VeduConnector_1.default();
        exports.connectorType = connectorType = 'vedu';
        break;
}
