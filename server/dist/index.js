"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
/* ROUTE IMPORTS */
const auth_1 = __importDefault(require("./routes/auth"));
const blog_1 = __importDefault(require("./routes/blog"));
const council_list_1 = __importDefault(require("./routes/council-list"));
const form_1 = __importDefault(require("./routes/form"));
const news_1 = __importDefault(require("./routes/news"));
const reports_publications_1 = __importDefault(require("./routes/reports-publications"));
const shop_1 = __importDefault(require("./routes/shop"));
/* CONFIGURATIONS */
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({
    policy: 'cross-origin',
}));
app.use((0, morgan_1.default)('common'));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
app.use(express_1.default.static('uploads'));
/* FILE STORAGE */
const uploadDir = path_1.default.join(__dirname, 'uploads');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir);
}
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Relative path for saving files
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Save the file with its original name
    },
});
const upload = (0, multer_1.default)({ storage });
/* ROUTES WITH FILES */
app.post('/api/v1/reports-publications', upload.single('file'), reports_publications_1.default);
app.post('/api/v1/shops', upload.single('file'), shop_1.default);
app.patch('/api/v1/shops/:id', upload.single('file'), shop_1.default);
app.patch('/api/v1/news/:id', upload.single('file'), news_1.default);
app.patch('/api/v1/blogs/:id', upload.single('file'), blog_1.default);
app.post('/api/v1/forms', upload.single('file'), form_1.default);
app.post('/api/v1/blogs', upload.single('file'), blog_1.default);
app.post('/api/v1/news', upload.single('file'), news_1.default);
/* ROUTES */
app.get('/', (req, res) => {
    res.send('This is home route');
});
app.get('/api/v1/uploads/:filename', (req, res) => {
    console.log(req.params.filename);
    const filename = req.params.filename;
    const filepath = path_1.default.join(uploadDir, filename);
    if (fs_1.default.existsSync(filepath)) {
        res.sendFile(filepath);
    }
    else {
        res.status(404).send('File not found');
    }
});
app.use('/api/v1/auth', auth_1.default);
app.use('/api/v1/shops', shop_1.default);
app.use('/api/v1/forms', form_1.default);
app.use('/api/v1/blogs', blog_1.default);
app.use('/api/v1/news', news_1.default);
app.use('/api/v1/council-lists', council_list_1.default);
app.use('/api/v1/reports-publications', reports_publications_1.default);
/* SERVER */
const PORT = Number(process.env.PORT) || 8000;
app.listen(PORT, () => {
    console.log(`Server Listening on port ${PORT}`);
});
