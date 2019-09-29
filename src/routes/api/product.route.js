import { Router } from 'express';
import ProductController from '../../controllers/product.controller';
import { queryValidation } from '../../middleware/validation';
import { querySchema } from '../../utils/validators/product.validator';
import { INVALID_QUERY_PARAMETERS } from '../../utils/constants';
// These are valid routes but they may contain a bug, please try to define and fix them

const router = Router();
// use query validation middleware for all product routes
router.use('/products', queryValidation(querySchema, INVALID_QUERY_PARAMETERS));
router.get('/products', ProductController.getAllProducts);
router.get('/products/:product_id', ProductController.getProduct);
router.get('/products/inCategory/:category_id', ProductController.getProductsByCategory);
router.get('/products/inDepartment/:department_id', ProductController.getProductsByDepartment);
router.get('/departments', ProductController.getAllDepartments);
router.get('/departments/:department_id', ProductController.getDepartment);
router.get('/categories', ProductController.getAllCategories);
router.get('/categories/:category_id', ProductController.getSingleCategory);
router.get('/categories/inDepartment/:department_id', ProductController.getDepartmentCategories);

export default router;
