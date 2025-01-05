import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import helmet from 'helmet';
import morgan from 'morgan';
import multer from 'multer';
import needle from 'needle';
import path from 'path';
import('node-fetch');

/* ROUTE IMPORTS */
import auth from './routes/auth';
import blogs from './routes/blog';
import councilLists from './routes/council-list';
import events from './routes/events';
import forms from './routes/form';
import news from './routes/news';
import reportsPublications from './routes/reports-publications';
import shops from './routes/shop';
import users from './routes/user';
import vacancies from './routes/vacancy';

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(
  helmet.crossOriginResourcePolicy({
    policy: 'cross-origin',
  })
);
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({ extended: false })
);
app.use(cors());
app.use(express.static('uploads'));

/* FILE STORAGE */
const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
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

const upload = multer({ storage });

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
  res.send(
    '<html><body><h1>Welcome to the Home Route</h1></body></html>'
  );
});
app.get(
  '/tama/uploads/download/:filename',
  (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(
      uploadDir,
      filename
    );

    if (fs.existsSync(filepath)) {
      // Force download by setting Content-Disposition header
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}"`
      );
      res.sendFile(filepath);
    } else {
      res.status(404).send('File not found');
    }
  }
);
app.get('/tama/uploads/:filename', (req, res) => {
  console.log(req.params.filename);
  const filename = req.params.filename;
  const filepath = path.join(uploadDir, filename);

  if (fs.existsSync(filepath)) {
    res.sendFile(filepath);
  } else {
    res.status(404).send('File not found');
  }
});

app.use('/tama/auth', auth);
app.use('/tama/shops', shops);
app.use('/tama/forms', forms);
app.use('/tama/blogs', blogs);
app.use('/tama/news', news);
app.use('/tama/users', users);
app.use('/tama/events', events);
app.use('/tama/vacancies', vacancies);
app.use('/tama/council-lists', councilLists);
app.use(
  '/tama/reports-publications',
  reportsPublications
);

interface Options {
  headers: {
    'User-Agent': string;
    authorization: string;
  };
}

interface Media {
  media_key: string;
  type: string; // e.g., "photo", "video"
  url?: string;
  preview_image_url?: string;
}

interface TweetParams {
  max_results: number;
  'tweet.fields': string;
  'media.fields': string;
  expansions: string;
  pagination_token?: string; // Optional for pagination
}

interface TweetResponse {
  data?: {
    id: string;
    text: string;
    created_at: string;
    attachments?: {
      media_keys: string[];
      poll_ids?: string[];
    };
    referenced_tweets?: { id: string }[];
    in_reply_to_user_id?: string;
    geo?: { place_id: string };
    entities?: {
      mentions: { username: string }[];
    };
  }[];
  includes: {
    users: {
      id: string;
      username: string;
    }[];
    media?: Media[];
  };
  meta: {
    result_count: number;
    next_token?: string; // Optional for pagination
  };
}

const userId = process.env.USER_ID!;
const url = `https://api.twitter.com/2/users/${userId}/tweets`;
const bearerToken = process.env.BEARER_TOKEN!;

// Function to fetch user tweets
const getUserTweets = async (): Promise<{
  userName: string;
  userTweets: Array<{
    id: string;
    text: string;
    created_at: string;
    attachments?: { media: Media[] };
  }>;
}> => {
  let userTweets: Array<{
    id: string;
    text: string;
    created_at: string;
    attachments?: { media: Media[] };
  }> = [];
  const params: TweetParams = {
    max_results: 100,
    'tweet.fields': 'created_at,attachments',
    'media.fields': 'url,preview_image_url,type',
    expansions: 'attachments.media_keys',
  };

  const options: Options = {
    headers: {
      'User-Agent': 'v2UserTweetsJS',
      authorization: `Bearer ${bearerToken}`,
    },
  };

  let hasNextPage = true;
  let nextToken: string | null = null;
  let userName: string | undefined;

  console.log('Retrieving Tweets...');

  while (hasNextPage) {
    const resp = await getPage(
      params,
      options,
      nextToken
    );

    if (resp && resp.meta?.result_count > 0) {
      userName = resp.includes.users[0]?.username;

      // Map media to tweets
      const mediaMap = new Map(
        resp.includes?.media?.map((media) => [
          media.media_key,
          media,
        ]) || []
      );

      const transformedTweets = resp.data?.map(
        (tweet) => ({
          id: tweet.id,
          text: tweet.text,
          created_at: tweet.created_at,
          attachments: tweet.attachments
            ? {
                media:
                  tweet.attachments.media_keys.map(
                    (key) => mediaMap.get(key)!
                  ),
              }
            : undefined,
        })
      );

      if (transformedTweets) {
        userTweets.push(...transformedTweets);
      }

      nextToken = resp.meta.next_token ?? null;
      hasNextPage = !!nextToken;
    } else {
      hasNextPage = false;
    }
  }

  console.log(
    `Got ${userTweets.length} Tweets from ${userName} (user ID ${userId})!`
  );
  return {
    userName: userName || 'Unknown User',
    userTweets,
  };
};

// Helper function to fetch a single page of tweets
const getPage = async (
  params: TweetParams,
  options: Options,
  nextToken: string | null
): Promise<TweetResponse | null> => {
  if (nextToken) {
    params.pagination_token = nextToken;
  }

  try {
    const resp = await needle(
      'get',
      url,
      params,
      options
    );

    if (resp.statusCode !== 200) {
      console.log(
        `${resp.statusCode} ${resp.statusMessage}:\n${resp.body}`
      );
      return null;
    }

    return resp.body as TweetResponse;
  } catch (err) {
    throw new Error(`Request failed: ${err}`);
  }
};

// Express route to fetch tweets
app.get('/tama/tweets', async (req, res) => {
  try {
    const { userName, userTweets } =
      await getUserTweets();

    res.status(200).json({
      success: true,
      userName,
      userId,
      tweets: userTweets,
    });
  } catch (error) {
    console.error(
      'Error fetching tweets:',
      error
    );

    res.status(500).json({
      success: false,
      message: 'Failed to fetch tweets',
      error: error,
    });
  }
});

/* SERVER */
const PORT = Number(process.env.PORT) || 8000;
app.listen(PORT, () => {
  console.log(`Server Listening on port ${PORT}`);
});
