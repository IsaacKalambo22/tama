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
const needle_1 = __importDefault(require("needle"));
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
// app.post(
//   '/tama/reports-publications',
//   upload.fields([{ name: 'file', maxCount: 1 }]),
//   (req, res, next) => {
//     console.log(req.body);
//     console.log(req.files);
//     try {
//       // Safely check if req.files is an object or array, then cast accordingly
//       const files = req.files as
//         | {
//             [
//               fieldname: string
//             ]: Express.Multer.File[];
//           }
//         | Express.Multer.File[]
//         | undefined;
//       if (!files || Array.isArray(files)) {
//         res.status(400).json({
//           message:
//             'Invalid file upload structure.',
//         });
//         return;
//       }
//       const file = files.file
//         ? files.file[0]
//         : null;
//       if (!file) {
//         res.status(400).json({
//           message: 'File is required.',
//         });
//         return;
//       }
//       // Function to construct file URLs
//       const constructFileUrl = (
//         file: Express.Multer.File
//       ) => {
//         return file.filename;
//       };
//       // Construct URLs for the uploaded files
//       const fileUrl = constructFileUrl(file);
//       // Attach URLs to the request body
//       req.body.fileUrl = fileUrl;
//       // Pass control to the next middleware or route handler
//       next();
//     } catch (error) {
//       console.error(
//         'Error processing uploaded files:',
//         error
//       );
//       res.status(500).json({
//         message: 'Internal server error.',
//       });
//     }
//   },
//   reportsPublications
// );
// app.post(
//   '/tama/forms',
//   upload.fields([{ name: 'file', maxCount: 1 }]),
//   (req, res, next) => {
//     console.log(req.body);
//     console.log(req.files);
//     try {
//       // Safely check if req.files is an object or array, then cast accordingly
//       const files = req.files as
//         | {
//             [
//               fieldname: string
//             ]: Express.Multer.File[];
//           }
//         | Express.Multer.File[]
//         | undefined;
//       if (!files || Array.isArray(files)) {
//         res.status(400).json({
//           message:
//             'Invalid file upload structure.',
//         });
//         return;
//       }
//       const file = files.file
//         ? files.file[0]
//         : null;
//       if (!file) {
//         res.status(400).json({
//           message: 'File is required.',
//         });
//         return;
//       }
//       // Function to construct file URLs
//       const constructFileUrl = (
//         file: Express.Multer.File
//       ) => {
//         return file.filename;
//       };
//       // Construct URLs for the uploaded files
//       const fileUrl = constructFileUrl(file);
//       // Attach URLs to the request body
//       req.body.fileUrl = fileUrl;
//       // Pass control to the next middleware or route handler
//       next();
//     } catch (error) {
//       console.error(
//         'Error processing uploaded files:',
//         error
//       );
//       res.status(500).json({
//         message: 'Internal server error.',
//       });
//     }
//   },
//   forms
// );
// app.post(
//   '/tama/shops',
//   upload.fields([{ name: 'file', maxCount: 1 }]),
//   (req, res, next) => {
//     console.log(req.body);
//     console.log(req.files);
//     try {
//       // Safely check if req.files is an object or array, then cast accordingly
//       const files = req.files as
//         | {
//             [
//               fieldname: string
//             ]: Express.Multer.File[];
//           }
//         | Express.Multer.File[]
//         | undefined;
//       if (!files || Array.isArray(files)) {
//         res.status(400).json({
//           message:
//             'Invalid file upload structure.',
//         });
//         return;
//       }
//       const file = files.file
//         ? files.file[0]
//         : null;
//       if (!file) {
//         res.status(400).json({
//           message: 'File is required.',
//         });
//         return;
//       }
//       // Function to construct file URLs
//       const constructFileUrl = (
//         file: Express.Multer.File
//       ) => {
//         return file.filename;
//       };
//       // Construct URLs for the uploaded files
//       const fileUrl = constructFileUrl(file);
//       // Attach URLs to the request body
//       req.body.imageUrl = fileUrl;
//       // Pass control to the next middleware or route handler
//       next();
//     } catch (error) {
//       console.error(
//         'Error processing uploaded files:',
//         error
//       );
//       res.status(500).json({
//         message: 'Internal server error.',
//       });
//     }
//   },
//   shops
// );
// app.post(
//   '/tama/blogs',
//   upload.fields([{ name: 'file', maxCount: 1 }]),
//   (req, res, next) => {
//     console.log(req.body);
//     console.log(req.files);
//     try {
//       // Safely check if req.files is an object or array, then cast accordingly
//       const files = req.files as
//         | {
//             [
//               fieldname: string
//             ]: Express.Multer.File[];
//           }
//         | Express.Multer.File[]
//         | undefined;
//       if (!files || Array.isArray(files)) {
//         res.status(400).json({
//           message:
//             'Invalid file upload structure.',
//         });
//         return;
//       }
//       const file = files.file
//         ? files.file[0]
//         : null;
//       if (!file) {
//         res.status(400).json({
//           message: 'File is required.',
//         });
//         return;
//       }
//       // Function to construct file URLs
//       const constructFileUrl = (
//         file: Express.Multer.File
//       ) => {
//         return file.filename;
//       };
//       // Construct URLs for the uploaded files
//       const fileUrl = constructFileUrl(file);
//       // Attach URLs to the request body
//       req.body.imageUrl = fileUrl;
//       // Pass control to the next middleware or route handler
//       next();
//     } catch (error) {
//       console.error(
//         'Error processing uploaded files:',
//         error
//       );
//       res.status(500).json({
//         message: 'Internal server error.',
//       });
//     }
//   },
//   blogs
// );
// app.post(
//   '/tama/news',
//   upload.fields([{ name: 'file', maxCount: 1 }]),
//   (req, res, next) => {
//     console.log(req.body);
//     console.log(req.files);
//     try {
//       // Safely check if req.files is an object or array, then cast accordingly
//       const files = req.files as
//         | {
//             [
//               fieldname: string
//             ]: Express.Multer.File[];
//           }
//         | Express.Multer.File[]
//         | undefined;
//       if (!files || Array.isArray(files)) {
//         res.status(400).json({
//           message:
//             'Invalid file upload structure.',
//         });
//         return;
//       }
//       const file = files.file
//         ? files.file[0]
//         : null;
//       if (!file) {
//         res.status(400).json({
//           message: 'File is required.',
//         });
//         return;
//       }
//       // Function to construct file URLs
//       const constructFileUrl = (
//         file: Express.Multer.File
//       ) => {
//         return file.filename;
//       };
//       // Construct URLs for the uploaded files
//       const fileUrl = constructFileUrl(file);
//       // Attach URLs to the request body
//       req.body.imageUrl = fileUrl;
//       // Pass control to the next middleware or route handler
//       next();
//     } catch (error) {
//       console.error(
//         'Error processing uploaded files:',
//         error
//       );
//       res.status(500).json({
//         message: 'Internal server error.',
//       });
//     }
//   },
//   news
// );
// app.patch(
//   '/tama/reports-publications/:id',
//   upload.fields([{ name: 'file', maxCount: 1 }]),
//   (req, res, next) => {
//     console.log(req.body);
//     console.log(req.files);
//     try {
//       const files = req.files as
//         | {
//             [
//               fieldname: string
//             ]: Express.Multer.File[];
//           }
//         | undefined;
//       const file = files?.file?.[0] ?? null;
//       if (file) {
//         // Construct URL for the uploaded file
//         const constructFileUrl = (
//           file: Express.Multer.File
//         ) => file.filename;
//         const fileUrl = constructFileUrl(file);
//         // Attach the file URL to the request body
//         req.body.fileUrl = fileUrl;
//         console.log(
//           'File uploaded and URL constructed:',
//           fileUrl
//         );
//       } else {
//         console.log(
//           'No file uploaded. Proceeding with the existing data.'
//         );
//       }
//       next();
//     } catch (error) {
//       console.error(
//         'Error processing uploaded files:',
//         error
//       );
//       res.status(500).json({
//         message: 'Internal server error.',
//       });
//     }
//   },
//   reportsPublications
// );
// app.patch(
//   '/tama/forms/:id',
//   upload.fields([{ name: 'file', maxCount: 1 }]),
//   (req, res, next) => {
//     console.log(req.body);
//     console.log(req.files);
//     try {
//       const files = req.files as
//         | {
//             [
//               fieldname: string
//             ]: Express.Multer.File[];
//           }
//         | undefined;
//       const file = files?.file?.[0] ?? null;
//       if (file) {
//         // Construct URL for the uploaded file
//         const constructFileUrl = (
//           file: Express.Multer.File
//         ) => file.filename;
//         const fileUrl = constructFileUrl(file);
//         // Attach the file URL to the request body
//         req.body.fileUrl = fileUrl;
//         console.log(
//           'File uploaded and URL constructed:',
//           fileUrl
//         );
//       } else {
//         console.log(
//           'No file uploaded. Proceeding with the existing data.'
//         );
//       }
//       next();
//     } catch (error) {
//       console.error(
//         'Error processing uploaded files:',
//         error
//       );
//       res.status(500).json({
//         message: 'Internal server error.',
//       });
//     }
//   },
//   forms
// );
// app.patch(
//   '/tama/shops/:id',
//   upload.fields([{ name: 'file', maxCount: 1 }]),
//   (req, res, next) => {
//     console.log(req.body);
//     console.log(req.files);
//     try {
//       const files = req.files as
//         | {
//             [
//               fieldname: string
//             ]: Express.Multer.File[];
//           }
//         | undefined;
//       const file = files?.file?.[0] ?? null;
//       if (file) {
//         // Construct URL for the uploaded file
//         const constructFileUrl = (
//           file: Express.Multer.File
//         ) => file.filename;
//         const fileUrl = constructFileUrl(file);
//         // Attach the file URL to the request body
//         req.body.imageUrl = fileUrl;
//         console.log(
//           'File uploaded and URL constructed:',
//           fileUrl
//         );
//       } else {
//         console.log(
//           'No file uploaded. Proceeding with the existing data.'
//         );
//       }
//       next();
//     } catch (error) {
//       console.error(
//         'Error processing uploaded files:',
//         error
//       );
//       res.status(500).json({
//         message: 'Internal server error.',
//       });
//     }
//   },
//   shops
// );
// app.patch(
//   '/tama/blogs/:id',
//   upload.fields([{ name: 'file', maxCount: 1 }]),
//   (req, res, next) => {
//     console.log(req.body);
//     console.log(req.files);
//     try {
//       const files = req.files as
//         | {
//             [
//               fieldname: string
//             ]: Express.Multer.File[];
//           }
//         | undefined;
//       const file = files?.file?.[0] ?? null;
//       if (file) {
//         // Construct URL for the uploaded file
//         const constructFileUrl = (
//           file: Express.Multer.File
//         ) => file.filename;
//         const fileUrl = constructFileUrl(file);
//         // Attach the file URL to the request body
//         req.body.imageUrl = fileUrl;
//         console.log(
//           'File uploaded and URL constructed:',
//           fileUrl
//         );
//       } else {
//         console.log(
//           'No file uploaded. Proceeding with the existing data.'
//         );
//       }
//       next();
//     } catch (error) {
//       console.error(
//         'Error processing uploaded files:',
//         error
//       );
//       res.status(500).json({
//         message: 'Internal server error.',
//       });
//     }
//   },
//   blogs
// );
// app.patch(
//   '/tama/news/:id',
//   upload.fields([{ name: 'file', maxCount: 1 }]),
//   (req, res, next) => {
//     console.log(req.body);
//     console.log(req.files);
//     try {
//       const files = req.files as
//         | {
//             [
//               fieldname: string
//             ]: Express.Multer.File[];
//           }
//         | undefined;
//       const file = files?.file?.[0] ?? null;
//       if (file) {
//         // Construct URL for the uploaded file
//         const constructFileUrl = (
//           file: Express.Multer.File
//         ) => file.filename;
//         const fileUrl = constructFileUrl(file);
//         // Attach the file URL to the request body
//         req.body.imageUrl = fileUrl;
//         console.log(
//           'File uploaded and URL constructed:',
//           fileUrl
//         );
//       } else {
//         console.log(
//           'No file uploaded. Proceeding with the existing data.'
//         );
//       }
//       next();
//     } catch (error) {
//       console.error(
//         'Error processing uploaded files:',
//         error
//       );
//       res.status(500).json({
//         message: 'Internal server error.',
//       });
//     }
//   },
//   news
// );
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
const userId = process.env.USER_ID;
const url = `https://api.twitter.com/2/users/${userId}/tweets`;
const bearerToken = process.env.BEARER_TOKEN;
// Function to fetch user tweets
const getUserTweets = () => __awaiter(void 0, void 0, void 0, function* () {
    let userTweets = [];
    const params = {
        max_results: 100,
        'tweet.fields': 'created_at',
        expansions: 'author_id',
    };
    const options = {
        headers: {
            'User-Agent': 'v2UserTweetsJS',
            authorization: `Bearer ${bearerToken}`,
        },
    };
    let hasNextPage = true;
    let nextToken = null;
    let userName;
    console.log('Retrieving Tweets...');
    while (hasNextPage) {
        const resp = yield getPage(params, options, nextToken);
        if (resp &&
            resp.meta &&
            resp.meta.result_count > 0) {
            userName = resp.includes.users[0].username;
            if (resp.data) {
                userTweets.push(...resp.data);
            }
            if (resp.meta.next_token) {
                nextToken = resp.meta.next_token;
            }
            else {
                hasNextPage = false;
            }
        }
        else {
            hasNextPage = false;
        }
    }
    console.log(`Got ${userTweets.length} Tweets from ${userName} (user ID ${userId})!`);
    return {
        userName: userName || 'Unknown User',
        userTweets,
    };
});
// Helper function to fetch a single page of tweets
const getPage = (params, options, nextToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (nextToken) {
        params.pagination_token = nextToken;
    }
    try {
        const resp = yield (0, needle_1.default)('get', url, params, options);
        if (resp.statusCode !== 200) {
            console.log(`${resp.statusCode} ${resp.statusMessage}:\n${resp.body}`);
            return null;
        }
        return resp.body;
    }
    catch (err) {
        throw new Error(`Request failed: ${err}`);
    }
});
// Express route to fetch tweets
app.get('/tama/tweets', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, userTweets } = yield getUserTweets();
        res.status(200).json({
            success: true,
            userName,
            userId,
            tweets: userTweets,
        });
    }
    catch (error) {
        console.error('Error fetching tweets:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch tweets',
            error: error,
        });
    }
}));
/* SERVER */
const PORT = Number(process.env.PORT) || 8000;
app.listen(PORT, () => {
    console.log(`Server Listening on port ${PORT}`);
});
