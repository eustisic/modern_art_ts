"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIClient = void 0;
const openai_1 = require("openai");
const logger_1 = __importDefault(require("../logger"));
class OpenAIClient {
    constructor() {
        if (!process.env.OPENAI_KEY || !process.env.OPENAI_URL) {
            logger_1.default.error('no openai key found');
            process.exit(1);
        }
        this.client = new openai_1.OpenAI({ apiKey: process.env.OPENAI_KEY });
        this.client.apiKey = process.env.OPENAI_KEY;
        this.client.baseURL = process.env.OPENAI_URL;
    }
    getPrompt(artist) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.client.chat.completions.create({
                    messages: [{ role: "system", content: `Create a list of 10 comma separated words that describe the style of ${artist}. Limit of 10 words` }],
                    model: 'gpt-3.5-turbo'
                });
                return (_d = (_c = (_b = (_a = response.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content) !== null && _d !== void 0 ? _d : '';
            }
            catch (e) {
                logger_1.default.error(e);
                return '';
            }
        });
    }
    isArtist(artist) {
        return __awaiter(this, void 0, void 0, function* () {
            const content = `I will provide the name of a potential artist and I want you to return a boolean 'true' or 'false' if the name supplied is an artist. Do not include any explanatory text - just the boolean. Artist: ${artist}`;
            try {
                const response = yield this.client.chat.completions.create({
                    messages: [{ role: 'system', content }],
                    model: 'gpt-3.5-turbo'
                });
                const isArtist = response.choices[0].message.content === 'True';
                logger_1.default.info(`${artist}: ${isArtist}`);
                return isArtist;
            }
            catch (e) {
                logger_1.default.error(`error verifying artist`);
                return false;
            }
        });
    }
    getImages(prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            const promptFormat = `Generate an image with no next from this description: ${prompt}`;
            try {
                const response = yield this.client.images.generate({
                    model: 'dall-e-2',
                    prompt: promptFormat,
                    size: "1024x1024",
                    quality: 'standard',
                    n: 5,
                });
                return response.data.map(image => { var _a; return (_a = image.url) !== null && _a !== void 0 ? _a : ''; });
            }
            catch (e) {
                logger_1.default.error(e);
                return [];
            }
        });
    }
}
exports.AIClient = new OpenAIClient();
exports.default = OpenAIClient;
