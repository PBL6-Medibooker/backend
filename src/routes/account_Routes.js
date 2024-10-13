const account_Controller =require('../app/controllers/account_Controller')
const require_Auth = require('../middleware/require_Auth')

const express = require('express')
const router = express.Router()

router.post('/login', account_Controller.acc_Login)
router.post('/signup', account_Controller.acc_Signup)
router.get('/acc-list', account_Controller.get_Account_List)
router.get('/get-acc/:id', account_Controller.get_Account)
router.post('/update-acc-info/:id', account_Controller.update_Acc_Info)
router.post('/soft-delete-acc', account_Controller.soft_Delete_Account)
router.post('/perma-delete-acc', account_Controller.perma_Delete_Account)
router.post('/restore-acc', account_Controller.restore_Deleted_Account)
router.post('/change-pass', account_Controller.change_password)

module.exports = router

