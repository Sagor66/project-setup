import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import globalErrorhandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';

const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:5173'] }));

// application routes
app.use('/api/v1/', router);

const test = async (req: Request, res: Response) => {
  const a = 10;
  res.send(a);
};

app.get('/', test);

app.use(globalErrorhandler);
app.use(notFound);

export default app;
