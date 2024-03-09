"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const handlers_1 = __importDefault(require("./handlers"));
const logger_1 = __importDefault(require("./logger"));
const app = express_1.default();
const PORT = 5000;
app.get('/', (_, res) => {
    res.send('Hello, world!');
});
app.post('/prompt', (req, res) => {
    handlers_1.default.promptHandler(req, res);
});
app.listen(PORT, () => {
    logger_1.default.log('info', `Server is running at http://localhost:${PORT}/`);
});
