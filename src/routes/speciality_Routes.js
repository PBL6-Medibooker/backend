const speciality_Controller = require("../app/controllers/speciality_Controller");
const authAdmin = require("../middleware/require_AdminAuth");

const express = require("express");
const router = express.Router();

router.post(
  "/get-speciality-list",
  authAdmin,
  speciality_Controller.get_Speciality_List
);
router.post("/add-speciality", authAdmin, speciality_Controller.add_Speciality);
router.get("/get-speciality/:id", authAdmin, speciality_Controller.getSpecData);
router.post(
  "/update-speciality/:id",
  authAdmin,
  speciality_Controller.update_Speciality
);
router.post(
  "/soft-delete-speciality",
  speciality_Controller.soft_Delete_Specialty
);
router.post("/delete-speciality", speciality_Controller.perma_Delete_Specialty);
router.post(
  "/restore-speciality",
  speciality_Controller.restore_Deleted_Specialty
);

module.exports = router;
