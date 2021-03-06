const AppError = require("../utils/appError");
const catchAsync  = require('../utils/catchAsync');

exports.authorization = (roles) => catchAsync(async(req, res, next) => {
    if(req.decoded.isDeactivated) {
        next(new AppError('User is deactivated!', 401));
    } else if(roles.includes(req.decoded.type)) {
        next();
    } else{
        next(new AppError('Unauthorized!', 401));
    }
});