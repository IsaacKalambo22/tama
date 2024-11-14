"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = exports.verifyManager = exports.verifyAdmin = exports.verifyToken = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Middleware to verify JWT and add user information to the request object
const verifyToken = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'] ||
        req.headers['Authorization'] ||
        '';
    const authHeader = authorizationHeader.toString();
    if (!authHeader.startsWith('Bearer ')) {
        res.status(401).json({
            message: 'Unauthorized: Invalid token format',
        });
        return;
    }
    const token = authHeader.split(' ')[1];
    jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                message: 'Forbidden: Invalid or expired token',
            });
        }
        const { id, email, role } = decoded;
        req.user = { id, email, role };
        next();
    });
};
exports.verifyToken = verifyToken;
// Middleware to check if the user is an Admin
const verifyAdmin = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === client_1.Role.ADMIN) {
        return next();
    }
    else {
        res.status(403).json({
            message: 'You are not authorized to access this resource',
        });
        return;
    }
};
exports.verifyAdmin = verifyAdmin;
// Middleware to check if the user is a Manager
const verifyManager = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === client_1.Role.MANAGER) {
        return next();
    }
    else {
        res.status(403).json({
            message: 'You are not authorized to access this resource',
        });
        return;
    }
};
exports.verifyManager = verifyManager;
// Middleware to check if the user is authenticated but does not require a specific role
const verifyUser = (req, res, next) => {
    if (req.user) {
        return next();
    }
    else {
        return res.status(401).json({
            message: 'You need to be logged in to access this resource',
        });
    }
};
exports.verifyUser = verifyUser;
