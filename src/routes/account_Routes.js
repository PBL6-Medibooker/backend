const account_Controller =require('../app/controllers/account_Controller')
const require_Auth = require('../middleware/require_Auth')

const express = require('express')
const router = express.Router()

router.post('/login', account_Controller.acc_Login)
router.post('/signup', account_Controller.acc_Signup)
router.post('/acc-list', account_Controller.get_Account_List)
router.post('/get-acc', account_Controller.get_Account)
router.post('/update-acc-info/:id', account_Controller.update_Acc_Info)
router.post('/soft-delete-acc', account_Controller.soft_Delete_Account)
router.post('/perma-delete-acc', account_Controller.perma_Delete_Account)
router.post('/restore-acc', account_Controller.restore_Deleted_Account)
router.post('/change-pass', account_Controller.change_password)
router.post('/update-doc-info/:id', account_Controller.update_Doctor_Info)
router.post('/upload-proof/:id', account_Controller.upload_Doctor_Proof)
router.get('/active-hour-list/:id', account_Controller.get_Doctor_Active_Hour_List)
router.post('/add-active-hour/:id', account_Controller.add_Doctor_Active_Hour)
router.post('/update-active-hour/:id', account_Controller.update_Doctor_Active_Hour)
router.post('/delete-active-hour/:id', account_Controller.delete_Doctor_Active_Hour)
router.post('/filter-doctor-list', account_Controller.get_Filtered_Doctor_List)

module.exports = router

