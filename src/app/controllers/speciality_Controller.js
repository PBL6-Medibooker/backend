const Speciality = require('../models/Speciality')

const sharp = require('sharp')
const multer = require('multer')
const { promisify } = require('util')

const storage = multer.memoryStorage()

const upload = multer({
  storage: storage,
  fileFilter: (res, file, cb) =>{
    if(file.mimetype === 'image/'){
      cb(null, true)
    }else{
      cb(new Error('Only image files are allowed'))
    }
  }
}).single('speciality_image')

const uploadPromise = promisify(upload)

class speciality_Controller{
    add_Speciality = async(req, res) =>{
        try{
            // wait for file upload
            await uploadPromise(req, res)
            
            // get info from body
            const {name, description} = req.body
            const speciality_image = req.file ? req.file.buffer : null

            //create
            const speciality = await Speciality.create({name, description, speciality_image})

            res.status(201).json(speciality)
        }catch(error){
            console.log(error.message)
            res.status(400).json({error: error.message})
        }
    }

    get_Speciality_List = async(req, res) =>{
        try{
            let specialities
            const {hidden_state} = req.body

            // find list of speciality
            if(hidden_state == 'true'){
                specialities = await Speciality.find({is_deleted: true})
            }else{
                specialities = await Speciality.find({is_deleted: false})
            }
            
            const specialities_With_Png_Images = await Promise.all(specialities.map(async (speciality) => {
                if (speciality.speciality_image) {

                    // convert buffer to png
                    const png_Buffer = await sharp(speciality.speciality_image)
                        .png()
                        .toBuffer()
    
                    const base64_Image = png_Buffer.toString('base64')
                    speciality.speciality_image = `data:image/png;base64,${base64_Image}`
                }
                return speciality
            }))

            res.status(200).json(specialities_With_Png_Images)
        }catch(error){
            console.log(error.message)
            res.status(400).json({error: error.message})
        }
    }
    
    update_Speciality = async(req, res) => {
        try{
            // wait for file upload
            await uploadPromise(req, res)
            
            // get info from body
            const {name, description} = req.body
            const speciality_image = req.file ? req.file.buffer : null

            // get id
            const speciality_Id = req.params.id

            // find speciality
            const speciality = await Speciality.findById(speciality_Id);

            if (!speciality) {
                return res.status(404).json({error: 'Speciality not found'});
            }

            // update
            if(name){
                speciality.name = name
            }
            if(description){
                speciality.description = description
            }
            if (speciality_image){
                speciality.speciality_image = speciality_image
            }

            await speciality.save()

            res.status(200).json(speciality)
        }catch(error){
            console.log(error.message)
            res.status(400).json({error: error.message})
        }
    }

    soft_Delete_Specialty = async(req, res) => {
        try{
            // get id list
            const {speciality_Ids} = req.body

            // if no ids
            if (!speciality_Ids || !Array.isArray(speciality_Ids) || speciality_Ids.length === 0) {
                return res.status(400).json({error: 'No IDs provided'});
            }

            // update
            const result = await Speciality.updateMany(
                {_id: {$in: speciality_Ids}},
                {is_deleted: true}
            )

            res.status(200).json({
                message: 'Speciality soft deleted',
                modifiedCount: result.modifiedCount
            })
            
        }catch(error){
            console.log(error.message)
            res.status(400).json({error: error.message})
        }
    }

    perma_Delete_Specialty = async (req, res) => {
        try{
            // get id list
            const {speciality_Ids} = req.body

            // if no ids
            if (!speciality_Ids || !Array.isArray(speciality_Ids) || speciality_Ids.length === 0) {
                return res.status(400).json({error: 'No IDs provided'});
            }

            // delete
            const result = await Speciality.deleteMany(
                {_id: {$in: speciality_Ids}}
            )

            res.status(200).json({
                message: 'Speciality deleted',
                deletedCount: result.deletedCount
            })
            
        }catch(error){
            console.log(error.message)
            res.status(400).json({error: error.message})
        }
    }
}

module.exports = new speciality_Controller