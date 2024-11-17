const article_Controller = require('../app/controllers/article_Controller')
const require_Auth = require('../middleware/require_Auth')

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
router.post('/search-article', article_Controller.search_Article_By_Title_and_Content)

module.exports = router