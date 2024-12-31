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
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
import('node-fetch');
/* ROUTE IMPORTS */
const auth_1 = __importDefault(require("./routes/auth"));
const blog_1 = __importDefault(require("./routes/blog"));
const council_list_1 = __importDefault(require("./routes/council-list"));
const events_1 = __importDefault(require("./routes/events"));
const form_1 = __importDefault(require("./routes/form"));
const news_1 = __importDefault(require("./routes/news"));
const reports_publications_1 = __importDefault(require("./routes/reports-publications"));
const shop_1 = __importDefault(require("./routes/shop"));
const user_1 = __importDefault(require("./routes/user"));
const vacancy_1 = __importDefault(require("./routes/vacancy"));
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
        const uniqueName = `${Date.now()}-${file.originalname
            .toLowerCase()
            .replace(/[\s-]+/g, '-')}`;
        cb(null, uniqueName); // Save the file with its uniqueName name
    },
});
const upload = (0, multer_1.default)({ storage });
/* ROUTES WITH FILES */
app.post('/tama/reports-publications', upload.fields([{ name: 'file', maxCount: 1 }]), (req, res, next) => {
    console.log(req.body);
    console.log(req.files);
    try {
        // Safely check if req.files is an object or array, then cast accordingly
        const files = req.files;
        if (!files || Array.isArray(files)) {
            res.status(400).json({
                message: 'Invalid file upload structure.',
            });
            return;
        }
        const file = files.file
            ? files.file[0]
            : null;
        if (!file) {
            res.status(400).json({
                message: 'File is required.',
            });
            return;
        }
        // Function to construct file URLs
        const constructFileUrl = (file) => {
            return file.filename;
        };
        // Construct URLs for the uploaded files
        const fileUrl = constructFileUrl(file);
        // Attach URLs to the request body
        req.body.fileUrl = fileUrl;
        // Pass control to the next middleware or route handler
        next();
    }
    catch (error) {
        console.error('Error processing uploaded files:', error);
        res.status(500).json({
            message: 'Internal server error.',
        });
    }
}, reports_publications_1.default);
app.post('/tama/forms', upload.fields([{ name: 'file', maxCount: 1 }]), (req, res, next) => {
    console.log(req.body);
    console.log(req.files);
    try {
        // Safely check if req.files is an object or array, then cast accordingly
        const files = req.files;
        if (!files || Array.isArray(files)) {
            res.status(400).json({
                message: 'Invalid file upload structure.',
            });
            return;
        }
        const file = files.file
            ? files.file[0]
            : null;
        if (!file) {
            res.status(400).json({
                message: 'File is required.',
            });
            return;
        }
        // Function to construct file URLs
        const constructFileUrl = (file) => {
            return file.filename;
        };
        // Construct URLs for the uploaded files
        const fileUrl = constructFileUrl(file);
        // Attach URLs to the request body
        req.body.fileUrl = fileUrl;
        // Pass control to the next middleware or route handler
        next();
    }
    catch (error) {
        console.error('Error processing uploaded files:', error);
        res.status(500).json({
            message: 'Internal server error.',
        });
    }
}, form_1.default);
app.post('/tama/shops', upload.single('file'), shop_1.default);
app.patch('/tama/shops/:id', upload.single('file'), shop_1.default);
app.patch('/tama/news/:id', upload.single('file'), news_1.default);
app.patch('/tama/forms/:id', upload.single('file'), form_1.default);
app.patch('/tama/reports-publications/:id', upload.single('file'), reports_publications_1.default);
app.patch('/tama/blogs/:id', upload.single('file'), blog_1.default);
app.post('/tama/blogs', upload.single('file'), blog_1.default);
app.post('/tama/news', upload.single('file'), news_1.default);
/* ROUTES */
app.get('/', (req, res) => {
    res.send('<html><body><h1>Welcome to the Home Route</h1></body></html>');
});
app.get('/tama/uploads/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = path_1.default.join(uploadDir, filename);
    if (fs_1.default.existsSync(filepath)) {
        // Force download by setting Content-Disposition header
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.sendFile(filepath);
    }
    else {
        res.status(404).send('File not found');
    }
});
app.get('/tama/uploads/:filename', (req, res) => {
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
app.use('/tama/auth', auth_1.default);
app.use('/tama/shops', shop_1.default);
app.use('/tama/forms', form_1.default);
app.use('/tama/blogs', blog_1.default);
app.use('/tama/news', news_1.default);
app.use('/tama/users', user_1.default);
app.use('/tama/events', events_1.default);
app.use('/tama/vacancies', vacancy_1.default);
app.use('/tama/council-lists', council_list_1.default);
app.use('/tama/reports-publications', reports_publications_1.default);
// Utility function to fetch tweets
const fetchTweets = (userId, bearerToken) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `https://api.twitter.com/2/users/${userId}/tweets?tweet.fields=text,public_metrics,attachments&expansions=attachments.media_keys&media.fields=type,url&max_results=100`;
    const response = yield fetch(url, {
        headers: {
            Authorization: `Bearer ${bearerToken}`,
        },
    });
    if (!response.ok) {
        throw new Error(`Twitter API error: ${response.statusText}`);
    }
    return response.json();
});
app.get('/tama/tweets', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
    const userId = '1799028002849984512'; // Replace with your Twitter user ID
    if (!BEARER_TOKEN) {
        res.status(500).json({
            error: 'Missing Twitter Bearer Token in environment variables.',
        });
        return;
    }
    try {
        const data = yield fetchTweets(userId, BEARER_TOKEN);
        // Extract relevant details from the response
        const tweets = data.data.map((tweet) => {
            var _a;
            const mediaKeys = ((_a = tweet.attachments) === null || _a === void 0 ? void 0 : _a.media_keys) || [];
            const media = mediaKeys.map((key) => {
                var _a, _b;
                return (_b = (_a = data.includes) === null || _a === void 0 ? void 0 : _a.media) === null || _b === void 0 ? void 0 : _b.find((m) => m.media_key === key);
            });
            return {
                text: tweet.text,
                images: (media === null || media === void 0 ? void 0 : media.filter((m) => (m === null || m === void 0 ? void 0 : m.type) === 'photo').map((m) => (m === null || m === void 0 ? void 0 : m.url) || '')) || [],
                metrics: {
                    comments: tweet.public_metrics.reply_count,
                    retweets: tweet.public_metrics.retweet_count,
                    likes: tweet.public_metrics.like_count,
                },
            };
        });
        res.json(tweets);
    }
    catch (error) {
        const errorMessage = error.message ||
            'Internal server error';
        console.error('Error fetching tweets:', errorMessage);
        res.status(502).json({ error: errorMessage });
    }
}));
/* SERVER */
const PORT = Number(process.env.PORT) || 8000;
app.listen(PORT, () => {
    console.log(`Server Listening on port ${PORT}`);
});
