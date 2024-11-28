import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import helmet from 'helmet';
import morgan from 'morgan';
import multer from 'multer';
import path from 'path';

/* ROUTE IMPORTS */
import auth from './routes/auth';
import blogs from './routes/blog';
import councilLists from './routes/council-list';
import forms from './routes/form';
import news from './routes/news';
import reportsPublications from './routes/reports-publications';
import shops from './routes/shop';

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
    cb(null, file.originalname); // Save the file with its original name
  },
});

const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post(
  '/api/v1/reports-publications',
  upload.single('file'),
  reportsPublications
);
app.post(
  '/api/v1/shops',
  upload.single('file'),
  shops
);
app.patch(
  '/api/v1/shops/:id',
  upload.single('file'),
  shops
);
app.patch(
  '/api/v1/news/:id',
  upload.single('file'),
  news
);
app.patch(
  '/api/v1/blogs/:id',
  upload.single('file'),
  blogs
);
app.post(
  '/api/v1/forms',
  upload.single('file'),
  forms
);
app.post(
  '/api/v1/blogs',
  upload.single('file'),
  blogs
);
app.post(
  '/api/v1/news',
  upload.single('file'),
  news
);

/* ROUTES */
app.get('/', (req, res) => {
  res.send('This is home route');
});
app.get(
  '/api/v1/uploads/:filename',
  (req, res) => {
    console.log(req.params.filename);
    const filename = req.params.filename;
    const filepath = path.join(
      uploadDir,
      filename
    );

    if (fs.existsSync(filepath)) {
      res.sendFile(filepath);
    } else {
      res.status(404).send('File not found');
    }
  }
);

app.use('/api/v1/auth', auth);
app.use('/api/v1/shops', shops);
app.use('/api/v1/forms', forms);
app.use('/api/v1/blogs', blogs);
app.use('/api/v1/news', news);
app.use('/api/v1/council-lists', councilLists);
app.use(
  '/api/v1/reports-publications',
  reportsPublications
);

/* SERVER */
const PORT = Number(process.env.PORT) || 8000;
app.listen(PORT, () => {
  console.log(`Server Listening on port ${PORT}`);
});
