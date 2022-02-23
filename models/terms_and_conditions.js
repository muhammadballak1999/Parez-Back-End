const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const terms_and_conditions_schema = new Schema({
    content: {type: String, default: null},

    //defaults
    createdAt: {type: Date, default: () => {return new Date(new Date().setHours(new Date().getHours() + 3))}},
    createdBy: {type: Schema.Types.ObjectId, ref:'User', default: null},
    isDeleted: {type: Boolean, default: false},
    deletedAt: {type: Date, default: null},
    deletedBy: {type: Schema.Types.ObjectId, ref:'User', default: null},
    updatedAt: {type: Date, default: null},
    updatedBy: {type: Schema.Types.ObjectId, ref:'User', default: null}
},{
    toObject: {virtuals: true},
    toJSON: {virtuals: true}
});

module.exports = mongoose.model('TermsAndConditions', terms_and_conditions_schema)