const Article = require('../models/Article')
const Doctor = require('../models/Doctor')
const User = require('../models/User')

const Speciality = require('../models/Speciality')

const sharp = require('sharp')
const multer = require('multer')
const { promisify } = require('util')

const storage = multer.memoryStorage()

const upload = multer({
  storage: storage,
  fileFilter: (res, file, cb) =>{
    if(file.mimetype.startsWith('image/')){
      cb(null, true)
    }else{
      cb(new Error('Only image files are allowed'))
    }
  }
}).single('article_image')

const uploadPromise = promisify(upload)


class article_Controller{

    add_Article = async(req, res) =>{
        try{
            // wait for file upload
            await uploadPromise(req, res)
            
            
            const {email, article_title, article_content, article_description} = req.body

            const article_image = req.file ? req.file.buffer : null

            const doctor = await Doctor.findOne({email}, {_id: 1})

            const article = await Article.create({doctor_id: doctor._id, article_title, article_content, article_description, article_image})

            res.status(201).json(article)
        }catch(error){
            res.status(400).json({error: error.message})
        }
    }

    get_Article = async(req, res) => {
        try {
            const article_id = req.params.id;
    
            const article = await Article.findById(article_id)
                .populate('doctor_id', 'email')  // Lấy email của doctor
                .populate('article_comments.replier', 'email profile_image'); // Lấy toàn bộ thông tin user trong replier
    
            if (!article) {
                return res.status(404).json({ error: 'Article not found' });
            }
    
            const articleObject = article.toObject();
    
            if (articleObject.article_image && Buffer.isBuffer(articleObject.article_image)) {
                articleObject.article_image = `data:image/png;base64,${articleObject.article_image.toString('base64')}`;
            }
    
            res.status(200).json(articleObject);
    
        } catch(error) {
            res.status(400).json({error: error.message});
        }
    }
    

    get_all_Article_By_Email = async(req, res) =>{
        try{
            const {email} = req.body
            const doctor = await Doctor.findOne({email}, {_id: 1})
            
            const articles = await Article.find({doctor_id: doctor._id}).populate('doctor_id', 'email')

            const articles_With_Png_Images = articles.map((article) => {
                const articleObject = article.toObject()
    
                if (articleObject.article_image && Buffer.isBuffer(articleObject.article_image)) {
                    // Convert buffer directly to base64 string
                    articleObject.article_image = `data:image/png;base64,${articleObject.article_image.toString('base64')}`
                }
    
                return articleObject
            })

            res.status(200).json(articles_With_Png_Images)
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

            const articles_With_Png_Images = articles.map((article) => {
                const articleObject = article.toObject()
    
                if (articleObject.article_image && Buffer.isBuffer(articleObject.article_image)) {
                    // Convert buffer directly to base64 string
                    articleObject.article_image = `data:image/png;base64,${articleObject.article_image.toString('base64')}`
                }
    
                return articleObject
            })

            res.status(200).json(articles_With_Png_Images)
        }catch(error){
            res.status(400).json({error: error.message})
        }
    }

    get_All_Article = async(req, res) =>{
        try{
            const articles = await Article.find().populate('doctor_id', 'email')

            const articles_With_Png_Images = articles.map((article) => {
                const articleObject = article.toObject()
    
                if (articleObject.article_image && Buffer.isBuffer(articleObject.article_image)) {
                    // Convert buffer directly to base64 string
                    articleObject.article_image = `data:image/png;base64,${articleObject.article_image.toString('base64')}`
                }
    
                return articleObject
            })

            res.status(200).json(articles_With_Png_Images)
        }catch(error){
            res.status(400).json({error: error.message})
        }
    }

    update_Article = async(req, res) =>{
        try{
            // wait for file upload
            await uploadPromise(req, res)
            const article_id = req.params.id
            const {article_title, article_content, article_description} = req.body
            const article_image = req.file ? req.file.buffer : null

            const article = await Article.findByIdAndUpdate(
                article_id,
                {article_title, article_content, article_description, article_image},
                {new: true}
            ).populate('doctor_id', 'email')

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

    add_Comment = async(req, res) =>{
        try{
            const article_id = req.params.id
            const{comment_email, comment_content} = req.body
            
            if(!comment_content){
                throw Error('No content')
            }

            const replier = await User.findOne({email: comment_email}, {_id: 1})

            const new_comment = {replier: replier._id, comment_content}

            const article = await Article.findByIdAndUpdate(
                article_id,
                {$push: {article_comments: new_comment}},
                {new: true}
            )

            res.status(201).json(article)

        }catch(error){
            res.status(400).json({error: error.message})
        }
    }

    update_Comment = async(req, res) =>{
        try{
            const {article_id, comment_id} = req.params
            const{comment_content} = req.body

            if(!comment_content){
                throw Error('No content')
            }

            const article = await Article.findById(article_id)

            if (!article) {
                return res.status(404).json({ error: 'Article not found' })
            }

            const comment = await article.article_comments.id(comment_id)

            if (!comment) {
                return res.status(404).json({ error: 'Comment not found' })
            }

            
            comment.comment_content = comment_content
            await article.save()

        }catch(error){
            res.status(400).json({error: error.message})
        }
    }

    del_Comment = async(req, res) =>{
        try{
            const {article_id, comment_id} = req.params

            const article = await Article.findById(article_id)

            if (!article) {
                return res.status(404).json({ error: 'Article not found' })
            }

            article.article_comments.pull({_id: comment_id})

            await article.save()

            res.status(200).json({
                message: 'Comment deleted successfully',
                article
            })
            
        }catch(error){
            res.status(400).json({error: error.message})
        }
    }
}


module.exports = new article_Controller