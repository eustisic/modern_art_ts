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
exports.uploadImages = void 0;
const aws_sdk_1 = require("aws-sdk");
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("../logger"));
const s3 = new aws_sdk_1.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});
const uploadImageFromUrl = (imageUrl, artist) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(imageUrl, {
            responseType: 'stream'
        });
        const id = Math.random().toString(16).slice(2);
        const key = `${artist}/${id}`;
        if (!process.env.S3_BUCKET) {
            logger_1.default.error('no bucket provided');
            throw new Error('no bucket provided');
        }
        logger_1.default.info(`uploading ${key}`);
        return s3.upload({
            Bucket: process.env.S3_BUCKET,
            Key: key,
            Body: response.data,
            ContentType: 'image/png'
        }).promise();
    }
    catch (e) {
        logger_1.default.error(`error uploading image for ${artist}`);
        throw e;
    }
});
const uploadImages = (imageUrls, artist) => __awaiter(void 0, void 0, void 0, function* () {
    const uploadPromises = imageUrls.map((imageUrl) => uploadImageFromUrl(imageUrl, artist));
    try {
        const results = yield Promise.all(uploadPromises);
        logger_1.default.info('All images have been uploaded successfully');
        return results;
    }
    catch (error) {
        logger_1.default.error('An error occurred:', error);
        throw error;
    }
});
exports.uploadImages = uploadImages;
