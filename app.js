import express from 'express';
import { showDatabases } from './db.js';
import { indexRouter } from './router/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('src'));
app.use(express.static('dist'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);

app.listen(PORT);

showDatabases();
