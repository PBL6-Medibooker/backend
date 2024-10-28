const Article = require('../models/Article')
const Doctor = require('../models/Doctor')
const Speciality = require('../models/Speciality')

class article_Controller{

    add_Article = async(req, res) =>{
        try{
            const {email, article_title, article_content} = req.body

            const doctor = await Doctor.findOne({email}, {_id: 1})

            const article = await Article.create({doctor_id: doctor._id, article_title, article_content})

            res.status(201).json(article)
        }catch(error){
            res.status(400).json({error: error.message})
        }
    }

    get_Article = async(req, res) =>{
        try{
            const article_id = req.params.id

            const article = await Article.findById(article_id).populate('doctor_id', 'email')

            res.status(200).json(article)
        }catch(error){
            res.status(400).json({error: error.message})
        }
    }

    get_all_Article_By_Email = async(req, res) =>{
        try{
            const {email} = req.body
            const doctor = await Doctor.findOne({email}, {_id: 1})
            
            const articles = await Article.find({doctor_id: doctor._id})

            res.status(200).json(articles)
        }catch(error){
            res.status(400).json({error: error.message})
        }
    }

    get_all_Article_by_Doctor_Speciality = async(req, res) =>{
        try{
            const {speciality_name} = req.body

            const speciality = await Speciality.findOne({name: speciality_name}, {_id: 1})
            if (!speciality) {
                return res.status(404).json({error: 'Speciality not found'})
            }

            const doctors = await Doctor.find({speciality_id: speciality._id}, {_id: 1})
            if (doctors.length === 0) {
                return res.status(404).json({error: 'No doctors found for this speciality'})
            }

            const doctor_ids = doctors.map(doctor => doctor._id)

            const articles = await Article.find({doctor_id: {$in: doctor_ids}}).populate('doctor_id', 'email')

            res.status(200).json(articles)
        }catch(error){
            res.status(400).json({error: error.message})
        }
    }

    get_All_Article = async(req, res) =>{
        try{
            const articles = await Article.find().populate('doctor_id', 'email')

            res.status(200).json(articles)
        }catch(error){
            res.status(400).json({error: error.message})
        }
    }

    update_Article = async(req, res) =>{
        try{
            const article_id = req.params.id
            const {article_title, article_content} = req.body

            const article = await Article.findByIdAndUpdate(
                article_id,
                {article_title, article_content},
                {new: true}
            )

            if (!article) {
                return res.status(404).json({error: 'Article not found'})
            }

            res.status(200).json(article)
        }catch(error){
            res.status(400).json({error: error.message})
        }
    }

    soft_Delete_Article = async(req, res) =>{
        try{
            // get id list
            const {article_ids} = req.body

            // if no ids
            if (!article_ids || !Array.isArray(article_ids) || article_ids.length === 0) {
                return res.status(400).json({error: 'No IDs provided'});
            }

            const result = await Article.updateMany(
                {_id: {$in: article_ids}},
                {is_deleted: true}
            )

            res.status(200).json({
                message: 'Articles soft deleted',
                modifiedCount: result.modifiedCount
            }) 

        }catch(error){
            res.status(400).json({error: error.message})
        }
    }

    restore_Article = async(req, res) =>{
        try{
            // get id list
            const {article_ids} = req.body

            // if no ids
            if (!article_ids || !Array.isArray(article_ids) || article_ids.length === 0) {
                return res.status(400).json({error: 'No IDs provided'});
            }

            const result = await Article.updateMany(
                {_id: {$in: article_ids}},
                {is_deleted: false}
            )

            res.status(200).json({
                message: 'Articles restored',
                modifiedCount: result.modifiedCount
            })

        }catch(error){
            res.status(400).json({error: error.message})
        }
    }

    perma_Delete_Article = async(req, res) =>{
        try{
            // get id list
            const {article_ids} = req.body

            // if no ids
            if (!article_ids || !Array.isArray(article_ids) || article_ids.length === 0) {
                return res.status(400).json({error: 'No IDs provided'});
            }

            const result = await Article.deleteMany(
                {_id: {$in: article_ids}}
            )

            res.status(200).json({
                message: 'Articles deleted',
                modifiedCount: result.deletedCount
            })

        }catch(error){
            res.status(400).json({error: error.message})
        }
    }

}

module.exports = new article_Controller