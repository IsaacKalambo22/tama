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

// // Utility function to fetch tweets
// const fetchTweets = async (
//   userId: string,
//   bearerToken: string
// ): Promise<TwitterApiResponse> => {
//   const url = `https://api.twitter.com/2/users/${userId}/tweets?tweet.fields=text,public_metrics,attachments&expansions=attachments.media_keys&media.fields=type,url&max_results=100`;

//   const response = await fetch(url, {
//     headers: {
//       Authorization: `Bearer ${bearerToken}`,
//     },
//   });

//   if (!response.ok) {
//     throw new Error(
//       `Twitter API error: ${response.statusText}`
//     );
//   }

//   return response.json();
// };

// app.get('/tama/tweets', async (req, res) => {
//   const BEARER_TOKEN =
//     process.env.TWITTER_BEARER_TOKEN;
//   const userId = '1799028002849984512'; // Replace with your Twitter user ID

//   if (!BEARER_TOKEN) {
//     res.status(500).json({
//       error:
//         'Missing Twitter Bearer Token in environment variables.',
//     });
//     return;
//   }

//   try {
//     const data = await fetchTweets(
//       userId,
//       BEARER_TOKEN
//     );

//     // Extract relevant details from the response
//     const tweets: SimplifiedTweet[] =
//       data.data.map((tweet) => {
//         const mediaKeys =
//           tweet.attachments?.media_keys || [];
//         const media = mediaKeys.map((key) =>
//           data.includes?.media?.find(
//             (m) => m.media_key === key
//           )
//         );

//         return {
//           text: tweet.text,
//           images:
//             media
//               ?.filter((m) => m?.type === 'photo')
//               .map((m) => m?.url || '') || [],
//           metrics: {
//             comments:
//               tweet.public_metrics.reply_count,
//             retweets:
//               tweet.public_metrics.retweet_count,
//             likes:
//               tweet.public_metrics.like_count,
//           },
//         };
//       });

//     res.json(tweets);
//   } catch (error: unknown) {
//     const errorMessage =
//       (error as Error).message ||
//       'Internal server error';
//     console.error(
//       'Error fetching tweets:',
//       errorMessage
//     );
//     res.status(502).json({ error: errorMessage });
//   }
// });

// app.get('/tama/tweets', async (req, res) => {
//   try {
//     const client = new TwitterApi({
//       appKey: process.env.API_KEY!,
//       appSecret: process.env.API_SECRET!,
//       accessToken: process.env.ACCESS_TOKEN,
//       accessSecret: process.env.ACCESS_SECRET,
//     });

//     const bearer = new TwitterApi(
//       process.env.BEARER_TOKEN!
//     );

//     const twitterClient = client.readWrite;
//     const twitterBearer = bearer.readOnly;
//     // Home timeline is available in v1 API, so use .v1 prefix
//     const homeTimeline =
//       await twitterClient.v2.ge;

//     // Current page is in homeTimeline.tweets
//     console.log(
//       homeTimeline.tweets.length,
//       'fetched.'
//     );

//     // const tweeter = await twitterClient.v2.tweet(
//     //   'Hello world!'
//     // );
//     // console.log({ tweeter });
//     // const jackTimeline =
//     //   await client.v2.userTimeline('12', {
//     //     expansions: [
//     //       'attachments.media_keys',
//     //       'attachments.poll_ids',
//     //       'referenced_tweets.id',
//     //     ],
//     //     'media.fields': ['url'],
//     //   });
//     // console.log({ jackTimeline });

//     res.status(200).json({
//       success: true,
//       data: homeTimeline, // Extract tweets
//     });
//     return;
//   } catch (error) {
//     console.error(
//       'Error fetching tweets:',
//       error
//     );

//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch tweets',
//       error: error,
//     });
//     return;
//   }
// });
interface Options {
  headers: {
    'User-Agent': string;
    authorization: string;
  };
}
interface TweetParams {
  max_results: number;
  'tweet.fields': string;
  'media.fields'?: string;
  expansions: string;
  pagination_token?: string; // Optional because it will only be added when paginating
}

interface Media {
  media_key: string;
  type: string; // e.g., "photo", "video", etc.
  url?: string; // For images or videos with URLs
  preview_image_url?: string; // For videos
}

interface TweetResponse {
  data?: {
    id: string;
    text: string;
    created_at: string;
    attachments?: {
      media_keys: string[];
    };
  }[];
  includes: {
    users: {
      id: string;
      username: string;
    }[];
    media?: Media[]; // Optional, as not all tweets have media
  };
  meta: {
    result_count: number;
    next_token?: string; // Optional because it might not exist
  };
}

const userId = process.env.USER_ID!;
const url = `https://api.twitter.com/2/users/${userId}/tweets`;
const bearerToken = process.env.BEARER_TOKEN!;

// Function to fetch user tweets
const getUserTweets = async (): Promise<{
  userName: string;
  userTweets: TweetResponse['data'];
}> => {
  let userTweets: TweetResponse['data'] = [];
  const params: TweetParams = {
    max_results: 100,
    'tweet.fields': 'created_at',
    expansions: 'author_id',
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
    if (
      resp &&
      resp.meta &&
      resp.meta.result_count > 0
    ) {
      userName = resp.includes.users[0].username;
      if (resp.data) {
        userTweets.push(...resp.data);
      }
      if (resp.meta.next_token) {
        nextToken = resp.meta.next_token;
      } else {
        hasNextPage = false;
      }
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
