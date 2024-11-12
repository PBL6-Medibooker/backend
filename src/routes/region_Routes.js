const region_Controller = require("../app/controllers/region_Controller");
const authAdmin = require("../middleware/require_AdminAuth");

const express = require("express");
const router = express.Router();

router.post("/get-region-list", authAdmin, region_Controller.get_Region_List);
router.post("/add-region", authAdmin, region_Controller.add_Region);
router.post("/get-region", authAdmin, region_Controller.get_Region);
router.post("/update-region/:id", authAdmin, region_Controller.update_Region);
router.post(
  "/soft-delete-region",
  authAdmin,
  region_Controller.soft_Delete_Region
);
router.post("/delete-region", authAdmin, region_Controller.perma_Delete_Region);
router.post(
  "/restore-region",
  authAdmin,
  region_Controller.restore_Deleted_Region
);

module.exports = router;
