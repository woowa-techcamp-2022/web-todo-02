import express from 'express';
import { indexRouter } from './router/index.js';
import { columnRouter } from './router/column.js';
import { todoRouter } from './router/todo.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('src'));
app.use(express.static('dist'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/column', columnRouter);
app.use('/todo', todoRouter);

app.listen(PORT);
