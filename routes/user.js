const router = require('express').Router();
const user = require('../controllers/user');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const verify_token = require('../middlewares/verify-token');
const { admin } = require('../utils/roles');
const photo = require('../middlewares/multer');
const { authorization } = require('../middlewares/authorization');


router.post('/users', verify_token, authorization([admin]), user.create);
router.get('/users', verify_token, authorization([admin]), user.get);

module.exports = router;