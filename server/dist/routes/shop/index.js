"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shop_1 = require("../../controllers/shop");
const router = (0, express_1.Router)();
router.post('/', shop_1.createShop);
exports.default = router;
