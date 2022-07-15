import express from 'express';
import path from 'path';
import { indexRouter } from './router/index.js';
import { columnRouter } from './router/column.js';
import { todoRouter } from './router/todo.js';
import { historyRouter } from './router/history.js';

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, 'src')));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/column', columnRouter);
app.use('/todo', todoRouter);
app.use('/history', historyRouter);

app.listen(PORT);
