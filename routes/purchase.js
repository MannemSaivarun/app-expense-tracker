const express = require('express');
const router = express.Router();

const purchaseControllers = require('../controllers/purchase')
const authentication = require('../middlewares/Auth')

router.get('/premiummembership', authentication.authenticate, purchaseControllers.purchasepremium)
router.post('/updatetransactionstatus', authentication.authenticate, purchaseControllers.updateTransactionStatus)

module.exports = router;