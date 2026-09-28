import { Router } from 'express';
import multer from 'multer';
import CategoryController from './app/controllers/CategoryController.js';
import ProductController from './app/controllers/ProductController.js';
import SessionController from './app/controllers/SessionController.js';
import UserController from './app/controllers/UserController.js';
// Importa o arquivo de configuração de upload criado separadamente
import multerConfig from './config/muter.cjs';
import adminMiddelware from './middlewares/admin.js';
import authMiddelware from './middlewares/auth.js';

const routes = new Router();
// 1. Inicializa a constante de upload passando as regras definidas em multerConfig
const upload = multer(multerConfig);

routes.post('/session', SessionController.store);

// 2. Rota de criação de produto com Middleware de Upload
// IMPORTANTE: O upload.single('file') atua como um "pedágio" antes da função do ProductController. Ele captura um único arquivo enviado com o nome de campo 'file' e o processa[cite: 2]
routes.post('/users', UserController.store);

routes.use(authMiddelware);

routes.post(
  '/products',
  adminMiddelware,
  upload.single('file'),
  ProductController.store,
);
routes.put(
  '/products/:id',
  adminMiddelware,
  upload.single('file'),
  ProductController.update,
);

routes.get('/products', ProductController.index);

routes.post(
  '/categories',
  adminMiddelware,
  upload.single('file'),
  CategoryController.store,
);
routes.get('/categories', CategoryController.index);

export default routes;
