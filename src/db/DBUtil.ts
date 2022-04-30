import MySQLConnector from './connector/MySQLConnector';
import VeduConnector from './connector/VeduConnector';
import IDBConnector from './connector/IDBConnector';

let DBUtil: IDBConnector;
let connectorType: string;

switch (process.env.DB_TYPE) {
	case 'mysql':
		DBUtil = new MySQLConnector();
		connectorType = 'mysql';
		break;
	case 'vedu':
	default:
		DBUtil = new VeduConnector();
		connectorType = 'vedu';
		break;
}

export {DBUtil, connectorType};
