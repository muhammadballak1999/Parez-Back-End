const router = require('express').Router();
const violence_cases = require('../controllers/violence_case');
const { authorization } = require('../middlewares/authorization');
const verify_token = require('../middlewares/verify-token');
const { admin, police, user } = require('../utils/roles');
const { ViolenceCasesValidators } =  require("../middlewares/validator/index");
const Validator = require("../middlewares/validator/validator");

router.get('/violence-cases', verify_token, authorization([admin, police, user]), violence_cases.get);
router.get('/violence-cases/report/:from/:to', verify_token, authorization([admin]), violence_cases.getReport);
router.get('/violence-cases/csv/:from/:to',  violence_cases.getCSV);
router.get('/violence-cases/:id', verify_token, authorization([admin, police]), violence_cases.getOne);
router.post('/violence-cases', verify_token, authorization([admin, police, user,]), Validator(ViolenceCasesValidators.create), violence_cases.create);
router.put('/violence-cases/user/reject', verify_token, authorization([user, admin, police]), violence_cases.rejectViolenceCase);
router.put('/violence-cases/:id', verify_token, authorization([admin, police]), Validator(ViolenceCasesValidators.update), violence_cases.update);
router.put('/violence-cases/:id/:status', verify_token, authorization([admin, police, user]), violence_cases.updateViolenceCaseStatus);
router.delete('/violence-cases/:id', verify_token, authorization([admin, police]), violence_cases.delete);

module.exports = router;