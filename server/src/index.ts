import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import('node-fetch');

/* ROUTE IMPORTS */
import auth from './routes/auth';
import blogs from './routes/blog';
import councilLists from './routes/council-list';
import events from './routes/events';
import forms from './routes/form';
import news from './routes/news';
import reportsPublications from './routes/reports-publications';
import search from './routes/search';
import services from './routes/service';
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

/* ROUTES */
app.get('/', (req, res) => {
  res.send(
    '<html><body><h1>Welcome to the Home Route</h1></body></html>'
  );
});

app.use('/tama/auth', auth);
app.use('/tama/shops', shops);
app.use('/tama/forms', forms);
app.use('/tama/blogs', blogs);
app.use('/tama/search', search);
app.use('/tama/news', news);
app.use('/tama/users', users);
app.use('/tama/events', events);
app.use('/tama/vacancies', vacancies);
app.use('/tama/services', services);
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
