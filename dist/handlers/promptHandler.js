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
const logger_1 = __importDefault(require("../logger"));
const kvstore_1 = require("../kvstore");
const openai_1 = require("../openai");
const uploadImages_1 = require("./uploadImages");
const promptHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let query = req.query.q;
    if (!query || typeof query !== 'string') {
        logger_1.default.log('info', 'no query string found');
        res.status(400).send(JSON.stringify({ message: 'bad request' }));
        return;
    }
    const artist = query.toUpperCase();
    let prompt, found, err;
    if (!kvstore_1.KVSTORE.has(artist)) {
        found = yield openai_1.AIClient.isArtist(artist);
        if (!found) {
            res.status(404).send(JSON.stringify({ message: 'artist not found' }));
            return;
        }
        // get prompt form open ai
        // insert into store
        prompt = yield openai_1.AIClient.getPrompt(artist);
        if (prompt && prompt.length) {
            kvstore_1.KVSTORE.set(artist, prompt);
        }
        else {
            err = `error getting prompt for ${artist}`;
            logger_1.default.error(err);
            res.status(500).send(JSON.stringify({ message: err }));
            return;
        }
    }
    // get prompt form store
    prompt = kvstore_1.KVSTORE.get(artist);
    // generate images and get image urls from prompt
    const imageUrls = yield openai_1.AIClient.getImages(prompt);
    try {
        // upload images to s3
        yield uploadImages_1.uploadImages(imageUrls, artist);
        res.status(200).send(JSON.stringify({ message: 'success' }));
    }
    catch (e) {
        res.status(500).send(JSON.stringify({ error: e }));
    }
});
exports.default = promptHandler;
