const Speciality = require('../models/Speciality')

// const sharp = require('sharp')
const multer = require('multer')
const { promisify } = require('util')
const fs = require('fs')
const path = require('path')
const mime = require('mime-types')
const mongoose = require('mongoose')

const Doctor = require('../models/Doctor')

require('dotenv').config()

const storage = multer.memoryStorage()

const upload = multer({
  storage: storage,
  fileFilter: (res, file, cb) => {
    if (file.mimetype === "image/jpeg") {
      cb(null, true)
    } else {
      cb(new Error("Only JPG image files are allowed"))
    }
  },
}).single("speciality_image")

const uploadPromise = promisify(upload)

class speciality_Controller {
  add_Speciality = async (req, res) => {
    try {
      // wait for file upload
      await uploadPromise(req, res)

      // get info from body
      const { name, description } = req.body
      const speciality_image = req.file ? req.file.buffer : null

      const exists_spec = await Speciality.findOne({ name })

      if (exists_spec) {
        throw new Error("Speciality already exits")
      }

      //create
      let speciality = await Speciality.create({ name, description })

      if (!speciality_image) {
        speciality.speciality_image = process.env.DEFAULT_SPECIALITY_IMG
      } else if (speciality_image) {
        // const file_Extension = mime.extension(req.file.mimetype) === 'jpeg' ? 'jpg' : mime.extension(req.file.mimetype)

        const image_name = `${speciality._id}.jpg`

        const images_Dir = path.join(
          __dirname,
          "../../../image/speciality-logos"
        )
        const image_Path = path.join(images_Dir, image_name)

        // check if directory exits
        if (!fs.existsSync(images_Dir)) {
          fs.mkdirSync(images_Dir, { recursive: true })
        }

        // save image
        fs.writeFileSync(image_Path, speciality_image)

        const speciality_image_path = `${req.protocol}://${req.get('host')}/images/speciality-logos/${image_name}`

        speciality.speciality_image = speciality_image_path

        await speciality.save()
      }

      res.status(201).json(speciality)
    } catch (error) {
      console.log(error.message)
      res.status(400).json({ error: error.message })
    }
  }

  get_Speciality_List = async (req, res) => {
    try {
      let specialities;
      const { hidden_state } = req.body

      // find list of speciality
      if (hidden_state == "true") {
        specialities = await Speciality.find({is_deleted: true})
      } else {
        specialities = await Speciality.find({is_deleted: false})
      }

      // const specialities_With_Png_Images = specialities.map((speciality) => {
      //     const specialityObject = speciality.toObject()

      //     if (specialityObject.speciality_image && Buffer.isBuffer(specialityObject.speciality_image)) {
      //         // Convert buffer directly to base64 string
      //         specialityObject.speciality_image = `data:image/png;base64,${specialityObject.speciality_image.toString('base64')}`
      //     }

      //     return specialityObject
      // })

      res.status(200).json(specialities)
    } catch (error) {
      console.log(error.message)
      res.status(400).json({error: error.message})
    }
  };

  update_Speciality = async (req, res) => {
    try {
      // wait for file upload
      await uploadPromise(req, res)

      // get info from body
      const { name, description } = req.body
      const speciality_image = req.file ? req.file.buffer : null

      // get id
      const speciality_Id = req.params.id

      // find speciality
      let speciality = await Speciality.findById(speciality_Id)

      if (!speciality) {
        return res.status(404).json({ error: "Speciality not found" })
      }

      // update
      if (name) {
        const existingSpeciality = await Speciality.findOne({
          name,
          _id: {$ne: speciality_Id},
        })
        if (existingSpeciality) {
          throw new Error('Speciality already exits')
        }
        speciality.name = name
      }
      if (description) {
        speciality.description = description
      }
      if (!speciality_image) {
        speciality.speciality_image = process.env.DEFAULT_SPECIALITY_IMG
      } else if (speciality_image) {
        // const file_Extension = mime.extension(req.file.mimetype) === 'jpeg' ? 'jpg' : mime.extension(req.file.mimetype)

        const image_name = `${speciality._id}.jpg`

        const images_Dir = path.join(
          __dirname,
          '../../../image/speciality-logos'
        )
        const image_Path = path.join(images_Dir, image_name)

        // check if directory exits
        if (!fs.existsSync(images_Dir)) {
          fs.mkdirSync(images_Dir, {recursive: true})
        }

        // save image
        fs.writeFileSync(image_Path, speciality_image)

        const speciality_image_path = `${req.protocol}://${req.get('host')}/images/speciality-logos/${image_name}`

        speciality.speciality_image = speciality_image_path
      }

      await speciality.save()

      res.status(200).json(speciality)
    } catch (error) {
      console.log(error.message)
      res.status(400).json({error: error.message})
    }
  }

  soft_Delete_Specialty = async (req, res) => {
    try {
      // get id list
      const { speciality_Ids } = req.body

      // if no ids
      if (
        !speciality_Ids ||
        !Array.isArray(speciality_Ids) ||
        speciality_Ids.length === 0
      ) {
        return res.status(400).json({error: 'No IDs provided'})
      }

      // update
      const result = await Speciality.updateMany(
        {_id: {$in: speciality_Ids}},
        {is_deleted: true}
      )

      res.status(200).json({
        message: 'Speciality soft deleted',
        modifiedCount: result.modifiedCount,
      })
    } catch (error) {
      console.log(error.message)
      res.status(400).json({error: error.message})
    }
  }

  restore_Deleted_Specialty = async (req, res) => {
    try {
      // get id list
      const {speciality_Ids} = req.body

      // if no ids
      if (
        !speciality_Ids ||
        !Array.isArray(speciality_Ids) ||
        speciality_Ids.length === 0
      ) {
        return res.status(400).json({error: 'No IDs provided'})
      }

      // update
      const result = await Speciality.updateMany(
        {_id: { $in: speciality_Ids}},
        {is_deleted: false}
      )

      res.status(200).json({
        message: 'Speciality restored',
        modifiedCount: result.modifiedCount,
      })
    } catch (error) {
      console.log(error.message)
      res.status(400).json({error: error.message})
    }
  }

  perma_Delete_Specialty = async (req, res) => {
    try {
      // get id list
      const { speciality_Ids } = req.body

      // if no ids
      if (
        !speciality_Ids ||
        !Array.isArray(speciality_Ids) ||
        speciality_Ids.length === 0
      ) {
        return res.status(400).json({error: 'No IDs provided'})
      }

      // delete
      const result = await Speciality.deleteMany({
        _id: {$in: speciality_Ids},
      })

      res.status(200).json({
        message: 'Speciality deleted',
        deletedCount: result.deletedCount,
      });
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  };

  getSpecData = async (req, res) => {
    try {
      const speciality_Id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(speciality_Id)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid Speciality ID format" });
      }
      const specData = await Speciality.findById(speciality_Id);
      res.json({ success: true, specData });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };

  getDoctorsCountPerSpeciality = async (req, res) => {
    try {
      const result = await Doctor.aggregate([
        {
          $group: {
            _id: "$speciality_id",
            doctorCount: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "specialities",
            localField: "_id",
            foreignField: "_id",
            as: "specialityDetails",
          },
        },
        {
          $unwind: "$specialityDetails",
        },
        {
          $match: {
            "specialityDetails.is_deleted": false,
          },
        },
        {
          $project: {
            _id: 0,
            speciality: "$specialityDetails.name",
            doctorCount: 1,
          },
        },
        {
          $sort: { doctorCount: -1 },
        },
        {
          $limit: 5,
        },
      ]);

      if (!result.length) {
        return res
          .status(404)
          .json({ message: "No specialties with doctors found." });
      }

      return res.status(200).json({ data: result });
    } catch (err) {
      console.error("Error :", err);
      return res.status(500).json({
        error: "An error occurred .",
      });
    }
  };
}

module.exports = new speciality_Controller();
