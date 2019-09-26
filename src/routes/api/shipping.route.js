import { Router } from 'express';
import ShippingController from '../../controllers/shipping.controller';
import { jwtAuthRequired } from '../../middleware/authentication';

const router = Router();
router.use('/shipping', jwtAuthRequired);
router.get('/shipping/regions', ShippingController.getShippingRegions);
router.get('/shipping/regions/:shipping_region_id', ShippingController.getShippingType);

export default router;
