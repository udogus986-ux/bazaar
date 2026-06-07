import { Router } from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware';

const router = Router();

// Herkese açık route'lar — token gerekmez
router.get('/', getProducts);
router.get('/:id', getProduct);

// Sadece admin route'ları
// authenticate → önce token kontrol et
// authorizeAdmin → sonra admin mi kontrol et
router.post('/', authenticate, authorizeAdmin, createProduct);
router.put('/:id', authenticate, authorizeAdmin, updateProduct);
router.delete('/:id', authenticate, authorizeAdmin, deleteProduct);

export default router;