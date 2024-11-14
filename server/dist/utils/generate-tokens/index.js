"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateTokens = (id, email, role) => {
    const access_token = jsonwebtoken_1.default.sign({
        id: id,
        email: email,
        role: role,
    }, process.env.JWT_ACCESS_SECRET_KEY, {
        expiresIn: '30min',
        algorithm: 'HS256', // Correct algorithm here
    });
    const refresh_token = jsonwebtoken_1.default.sign({
        id: id,
        email: email,
        role: role,
    }, process.env.JWT_REFRESH_SECRET_KEY, {
        expiresIn: '1d',
        algorithm: 'HS256', // Correct algorithm here
    });
    return { access_token, refresh_token };
};
exports.generateTokens = generateTokens;
