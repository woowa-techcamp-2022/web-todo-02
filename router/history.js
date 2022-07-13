import express from 'express';
import controller from '../controller/Controller.js';

export const historyRouter = express.Router();

historyRouter.get('/', controller.getAllHistory);
historyRouter.post('/', controller.postHistory);
