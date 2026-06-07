import { Router } from 'express';
import { getAddresses, createAddress, updateAddress, deleteAddress, setDefaultAddress } from '../controllers/address.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getAddresses);
router.post('/', createAddress);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);
router.put('/:id/default', setDefaultAddress);

export default router;