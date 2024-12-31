import express from 'express';
import cors from 'cors';

export const configureMiddlewares = (app) => {
  app.use(cors());
  app.use(express.json());
  app.use(express.static('public'));
};
