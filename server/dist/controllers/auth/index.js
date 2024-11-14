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
exports.login = exports.registerUser = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const generate_tokens_1 = require("../../utils/generate-tokens");
const prisma = new client_1.PrismaClient();
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role } = req.body;
    // Validate user input
    if (!name || !email || !password) {
        res.status(400).json({
            success: false,
            message: 'Name, email, and password are required.',
        });
        return; // Ensure early exit after sending response
    }
    try {
        // Check if the email already exists
        const existingUser = yield prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            res.status(409).json({
                success: false,
                message: 'Email already in use. Please use a different email.',
            });
            return; // Ensure early exit after sending response
        }
        // Hash the password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Create the user
        const newUser = yield prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || client_1.Role.USER,
            },
        });
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    }
    catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while creating the user. Please try again later.',
        });
    }
});
exports.registerUser = registerUser;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Validate user input
    if (!email || !password) {
        res.status(400).json({
            success: false,
            message: 'Email and password are required.',
        });
        return;
    }
    try {
        // Check if the user exists
        const user = yield prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found. Please check your email.',
            });
            return;
        }
        // Compare the provided password with the stored hash
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials. Please check your password.',
            });
            return;
        }
        const { access_token, refresh_token } = (0, generate_tokens_1.generateTokens)(user.id, user.email, user.role);
        // Set the refresh token as an HTTP-only cookie for secure token refreshing
        res.cookie('jwt-refresh', refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: true,
            maxAge: 1000 * 60 * 60 * 1,
        });
        // Return a success response with the generated token
        res.status(200).json({ access_token });
    }
    catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while logging in. Please try again later.',
        });
    }
});
exports.login = login;
