const account_Controller =require('../app/controllers/account_Controller')
const require_Auth = require('../middleware/require_Auth')

const express = require('express')
const router = express.Router()

router.post('/login', account_Controller.acc_Login)
router.post('/signup', account_Controller.acc_Signup)
router.get('/acc-list', account_Controller.get_Account_List)

module.exports = router

