"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyManager = exports.verifyAdmin = exports.verifyJWT = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyJWT = (req, res, next) => {
    // Retrieve the authorization header or assign an empty string if it's null/undefined
    const authorizationHeader = req.headers['authorization'] ||
        req.headers['Authorization'] ||
        '';
    const authHeader = authorizationHeader.toString();
    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Unauthorized: Invalid token format',
        });
    }
    // Extract the token from the authorization header
    const token = authHeader.split(' ')[1];
    // Verify the token with JWT
    jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                message: 'Forbidden: Invalid or expired token',
            });
        }
        // Extract user information from the decoded payload
        const { id, email, role } = decoded;
        // Attach user information to the request object
        req.user = { id, email, role };
        next();
    });
};
exports.verifyJWT = verifyJWT;
const verifyAdmin = (req, res, next) => {
    // Ensure the token is verified first
    (0, exports.verifyJWT)(req, res, () => {
        var _a;
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === client_1.Role.ADMIN) {
            // Proceed if the user is an admin
            return next();
        }
        else {
            // Directly return a 403 Forbidden response if the user is not an admin
            return res.status(403).json({
                message: 'You are not authorized to access this resource',
            });
        }
    });
};
exports.verifyAdmin = verifyAdmin;
const verifyManager = (req, res, next) => {
    // Ensure the token is verified first
    (0, exports.verifyJWT)(req, res, () => {
        var _a;
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === client_1.Role.MANAGER) {
            // Proceed if the user is an admin
            return next();
        }
        else {
            // Directly return a 403 Forbidden response if the user is not an admin
            return res.status(403).json({
                message: 'You are not authorized to access this resource',
            });
        }
    });
};
exports.verifyManager = verifyManager;
