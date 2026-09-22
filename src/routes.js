import { Router } from 'express';
import multer from 'multer';
import ProductController from './app/controllers/ProductController.js';
import SessionController from './app/controllers/SessionController.js';
import UserController from './app/controllers/UserController.js';
// Importa o arquivo de configuração de upload criado separadamente[cite: 2]
import multerConfig from './config/muter.cjs';

const routes = new Router();
// 1. Inicializa a constante de upload passando as regras definidas em multerConfig[cite: 2]
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

// 2. Rota de criação de produto com Middleware de Upload[cite: 2]
// IMPORTANTE: O upload.single('file') atua como um "pedágio" antes da função do ProductController. Ele captura um único arquivo enviado com o nome de campo 'file' e o processa[cite: 2]
routes.post('/products', upload.single('file'), ProductController.store);

routes.get('/products', ProductController.index);

export default routes;
