import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { swaggerRouter } from './swagger';

const app = new Koa();

app.use(bodyParser());
app.use(errorHandler);

// Swagger 路由 (独立模块)
app.use(swaggerRouter.routes()).use(swaggerRouter.allowedMethods());

// API 路由
app.use(routes.routes()).use(routes.allowedMethods());

export default app;
