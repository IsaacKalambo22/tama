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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShop = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createShop = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, imageUrl, address, openHours } = req.body;
    // Validate input
    if (!name ||
        !imageUrl ||
        !address ||
        !openHours) {
        res.status(400).json({
            success: false,
            message: 'Name, address, and open hours are required.',
            error: 'Validation error',
        });
        return;
    }
    try {
        // Create the new shop
        const newShop = yield prisma.shop.create({
            data: {
                name,
                imageUrl,
                address,
                openHours,
            },
        });
        // Respond with success
        res.status(201).json({
            success: false,
            message: 'Shop created successfully',
            data: newShop,
        });
    }
    catch (error) {
        console.error('Error creating shop:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while creating the shop. Please try again later.',
            error: error.message,
        });
    }
});
exports.createShop = createShop;
