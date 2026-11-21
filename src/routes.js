import { Router } from 'express'
import multer from 'multer'

import CategoryController from './app/controllers/CategoryController.js'
import OrderController from './app/controllers/OrderController.js'
import ProductController from './app/controllers/ProductController.js'
import SessionController from './app/controllers/SessionController.js'
import UserController from './app/controllers/UserController.js'
import adminMiddleware from './app/middlewares/admin.js'
import authMiddleware from './app/middlewares/auth.js'
import multerConfig from './config/multer.cjs'
import CreatePaymentIntentController from './app/controllers/stripe/CreatePaymentIntentController.js'


const routes = new Router();

//Metodos HTTP
/*
POST --> CRIAR
PUT/PATCH --> ATUALIZAR
GET --> BUSCAR
DELETE --> DELETAR
*/

const upload = multer(multerConfig)

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware)

routes.post('/products', adminMiddleware, upload.single('file'), ProductController.store)
routes.put('/products/:id', adminMiddleware, upload.single('file'), ProductController.update)
routes.get('/products', ProductController.index)

routes.post('/categories', adminMiddleware, upload.single('file'), CategoryController.store)
routes.put('/categories/:id', adminMiddleware, upload.single('file'), CategoryController.update)
routes.get('/categories', CategoryController.index)

routes.post('/orders', OrderController.store)
routes.put('/orders/:id', adminMiddleware, OrderController.update)
routes.get('/orders', OrderController.index)

routes.post('/create-payment-intent', CreatePaymentIntentController.store)

export default routes
