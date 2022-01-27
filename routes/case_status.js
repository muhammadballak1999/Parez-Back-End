const router = require('express').Router();
const case_status = require('../controllers/case_status');
const { authorization } = require('../middlewares/authorization');
const verify_token = require('../middlewares/verify-token');
const { admin } = require('../utils/roles');
const { CaseStatusValidators } =  require("../middlewares/Validator/index");
const Validator = require("../middlewares/Validator/validator");

router.get('/case-status', verify_token, authorization([admin]), case_status.get);
router.get('/case-status/:id', verify_token, authorization([admin]), case_status.getOne);
router.post('/case-status', verify_token, authorization([admin]), Validator(CaseStatusValidators.create), case_status.create);
router.put('/case-status/:id', verify_token, authorization([admin]), Validator(CaseStatusValidators.update), case_status.update);
router.delete('/case-status/:id', verify_token, authorization([admin]), case_status.delete);

module.exports = router;