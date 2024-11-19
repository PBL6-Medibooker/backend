const article_Controller = require('../app/controllers/article_Controller')

const express = require('express')
const router = express.Router()

router.post('/create-article', article_Controller.add_Article)
router.get('/get-article/:id', article_Controller.get_Article)
router.get('/get-all-article', article_Controller.get_All_Article)
router.post('/get-all-article-by-doctor', article_Controller.get_all_Article_By_Email)
router.post('/get-all-article-by-speciality', article_Controller.get_all_Article_by_Doctor_Speciality)
router.post('/update-article/:id', article_Controller.update_Article)
router.post('/soft-del-article', article_Controller.soft_Delete_Article)
router.post('/restore-article', article_Controller.restore_Article)
router.post('/perma-del-article', article_Controller.perma_Delete_Article)
router.post('/add-comment/:id', article_Controller.add_Comment)
router.post('/:article_id/comment/:comment_id/update', article_Controller.update_Comment)
router.post('/:article_id/comment/:comment_id/del', article_Controller.del_Comment)

module.exports = router