const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const ProductController = require('../controllers/products');
const multerConfig = require('../config/multerConfig');

router.get('/', ProductController.products_get_all);
router.post('/', checkAuth, multerConfig.MY_UPLOAD_STORAGE_MULTER.single('productImage'), ProductController.products_create_product);
router.get('/:id', ProductController.products_get_product);
router.patch('/:id', checkAuth, ProductController.products_update_product);
router.delete('/:id', checkAuth, ProductController.products_remove_product);

module.exports = router;