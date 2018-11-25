const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const OrderController = require('../controllers/orders');

router.get('/', checkAuth, OrderController.orders_get_all);
router.post('/', checkAuth, OrderController.orders_create_order);
router.get('/:id', checkAuth, OrderController.orders_get_order);
router.delete('/:id', checkAuth, OrderController.orders_remove_order);

module.exports = router;