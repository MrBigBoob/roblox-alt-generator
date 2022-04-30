"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const RobloxUtils_1 = __importDefault(require("../rbx/RobloxUtils"));
const AccountsRouter_1 = __importDefault(require("./AccountsRouter"));
const router = express_1.default.Router();
router.use('/accounts', AccountsRouter_1.default);
router.get('/field_data', async (_, res) => {
    res.send(await RobloxUtils_1.default.getFieldData());
});
router.get('/', (_, res) => {
    res.json({
        success: true,
        repo: 'https://github.com/RbxGen/RobloxGen/'
    });
});
exports.default = router;
