"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promptHandler_1 = __importDefault(require("./promptHandler"));
const handlers = {
    promptHandler: promptHandler_1.default
};
exports.default = handlers;
