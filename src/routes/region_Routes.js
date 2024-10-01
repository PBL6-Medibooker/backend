const region_Controller = require('../app/controllers/region_Controller')

const express = require('express')
const router = express.Router()

router.get('/get-region-list', region_Controller.get_Region_List)
router.post('/add-region', region_Controller.add_Region)
router.post('/update-region/:id', region_Controller.update_Region)
router.post('/soft-delete-region', region_Controller.soft_Delete_Region)
router.post('/delete-region', region_Controller.perma_Delete_Region)

module.exports = router