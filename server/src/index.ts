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
    cb(null, file.originalname); // Save the file with its original name
  },
});

const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post(
  '/tama/reports-publications',
  upload.single('file'),
  reportsPublications
);
app.post(
  '/tama/shops',
  upload.single('file'),
  shops
);
app.patch(
  '/tama/shops/:id',
  upload.single('file'),
  shops
);
app.patch(
  '/tama/news/:id',
  upload.single('file'),
  news
);
app.patch(
  '/tama/forms/:id',
  upload.single('file'),
  forms
);
app.patch(
  '/tama/reports-publications/:id',
  upload.single('file'),
  reportsPublications
);
app.patch(
  '/tama/blogs/:id',
  upload.single('file'),
  blogs
);
app.post(
  '/tama/forms',
  upload.single('file'),
  forms
);
app.post(
  '/tama/blogs',
  upload.single('file'),
  blogs
);
app.post(
  '/tama/news',
  upload.single('file'),
  news
);

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

/* SERVER */
const PORT = Number(process.env.PORT) || 8000;
app.listen(PORT, () => {
  console.log(`Server Listening on port ${PORT}`);
});
