import { Router } from 'express';
import AttributeController from '../../controllers/attributes.controller';
import { queryValidation } from '../../middleware/validation';

const router = Router();

router.get('/attributes', queryValidation(), AttributeController.getAllAttributes);
router.get('/attributes/:attribute_id', AttributeController.getSingleAttribute);
router.get('/attributes/values/:attribute_id', AttributeController.getAttributeValues);
router.get('/attributes/inProduct/:product_id', AttributeController.getProductAttributes);

export default router;
