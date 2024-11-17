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
exports.deleteShop = exports.updateShop = exports.getAllShops = exports.createShop = void 0;
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
            success: true,
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
const getAllShops = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all shops from the database
        const shops = yield prisma.shop.findMany();
        // Respond with success
        res.status(200).json({
            success: true,
            message: 'Shops retrieved successfully',
            data: shops,
        });
    }
    catch (error) {
        console.error('Error fetching shops:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching shops. Please try again later.',
            error: error.message,
        });
    }
});
exports.getAllShops = getAllShops;
const updateShop = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, imageUrl, address, openHours } = req.body;
    // Validate input
    if (!id) {
        res.status(400).json({
            success: false,
            message: 'Shop ID is required.',
            error: 'Validation error',
        });
        return;
    }
    try {
        // Check if the shop exists
        const existingShop = yield prisma.shop.findUnique({
            where: { id },
        });
        if (!existingShop) {
            res.status(404).json({
                success: false,
                message: 'Shop not found.',
            });
            return;
        }
        // Update the shop details
        const updatedShop = yield prisma.shop.update({
            where: { id },
            data: {
                name: name !== null && name !== void 0 ? name : existingShop.name,
                imageUrl: imageUrl !== null && imageUrl !== void 0 ? imageUrl : existingShop.imageUrl,
                address: address !== null && address !== void 0 ? address : existingShop.address,
                openHours: openHours !== null && openHours !== void 0 ? openHours : existingShop.openHours,
            },
        });
        // Respond with success
        res.status(200).json({
            success: true,
            message: 'Shop updated successfully',
            data: updatedShop,
        });
    }
    catch (error) {
        console.error('Error updating shop:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating the shop. Please try again later.',
            error: error.message,
        });
    }
});
exports.updateShop = updateShop;
const deleteShop = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Validate input
    if (!id) {
        res.status(400).json({
            success: false,
            message: 'Shop ID is required.',
            error: 'Validation error',
        });
        return;
    }
    try {
        // Check if the shop exists
        const existingShop = yield prisma.shop.findUnique({
            where: { id },
        });
        if (!existingShop) {
            res.status(404).json({
                success: false,
                message: 'Shop not found.',
            });
            return;
        }
        // Delete the shop
        yield prisma.shop.delete({
            where: { id },
        });
        // Respond with success
        res.status(200).json({
            success: true,
            message: 'Shop deleted successfully',
        });
    }
    catch (error) {
        console.error('Error deleting shop:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while deleting the shop. Please try again later.',
            error: error.message,
        });
    }
});
exports.deleteShop = deleteShop;
