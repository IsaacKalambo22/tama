import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

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

/* ROUTES */
app.get('/', (req, res) => {
  res.send('This is home route');
});

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
  console.log(`Server Listening on part ${PORT}`);
});
