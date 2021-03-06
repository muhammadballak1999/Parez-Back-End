const AnnouncementAndRule = require("../models/announcement_and_rule");
const Attachment = require("../models/attachment");
const catchAsync  = require('../utils/catchAsync');
const { uploadToCloud } = require("../utils/cloudUpload");
const { send_notification } = require("../utils/fcm");

// Get Announcements and rules

exports.get = catchAsync(async(req, res, next) => {
    
    let announcements_and_rules = await AnnouncementAndRule.find({isDeleted: false})
    .populate('attachment', 'url')
    .select('-createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted')
    .sort({_id: -1})
    .exec();

    res.status(200).send({
        success: true,
        message: 'All Announcements and rules fetched successfully',
        data: announcements_and_rules
    })

});

// Get One Announcement and rule

exports.getOne = catchAsync(async(req, res, next) => {

    let announcement_and_rule = await AnnouncementAndRule.findOne({_id: req.params.id, isDeleted: false}).populate('attachment', 'url').exec();
    if(announcement_and_rule) {
        res.status(200).send({
            success: true,
            message: 'Announcement and rule fetched successfully',
            data: announcement_and_rule
        })
        return
        }
        res.status(404).send({
            success: false,
            message: 'No Announcement and rule was found!',
            data: {}
        })
});

// Create Announcement and rule

exports.create = catchAsync(async(req, res, next) => {

    var announcement_and_rule = new AnnouncementAndRule();
    announcement_and_rule.title = req.body.title;
    announcement_and_rule.content = req.body.content; 
    announcement_and_rule.createdBy = req.decoded.id;

    if(req.file) {
    var attachment = await uploadToCloud(req);
    announcement_and_rule.attachment = attachment.id;
   }

    await announcement_and_rule.save();
    await send_notification(req.body.title, req.body.content, "", true);

    res.status(200).send({
        success: true,
        message: 'Announcement and rule created successfully',
        data: announcement_and_rule
    });
});

// Update Announcement and rule

exports.update = catchAsync(async(req, res, next) => {

    let announcement_and_rule = await AnnouncementAndRule.findOne({_id: req.params.id, isDeleted: false});

    if(!announcement_and_rule) { 
        res.status(404).send({
            success: false,
            message: 'No Announcement and rule was found!',
            data: {}
        })  
    }

    if(req.body.title && req.body.title !== announcement_and_rule.title){announcement_and_rule.title = req.body.title}
    if(req.body.content && req.body.content !== announcement_and_rule.content){announcement_and_rule.content = req.body.content}
    announcement_and_rule.updatedBy = req.decoded.id;
    announcement_and_rule.updatedAt = new Date(Date.now());

    if(req.file) {
        var attachment = await uploadToCloud(req);
        announcement_and_rule.attachment = attachment.id;
    }

    await announcement_and_rule.save();

    res.status(200).send({
        success: true,
        message: 'Announcement and rule updated successfully',
        data: announcement_and_rule
    })
});

// Delete Announcement and rule

exports.delete = catchAsync(async(req, res, next) => {

    let announcement_and_rule = await AnnouncementAndRule.findOne({_id: req.params.id, isDeleted: false});

    if(!announcement_and_rule) { 
        res.status(404).send({
            success: false,
            message: 'No Announcement and rule was found!',
            data: {}
        })  
        return
    }

    announcement_and_rule.isDeleted = true;
    announcement_and_rule.deletedBy = req.decoded.id;
    announcement_and_rule.deletedAt = new Date(Date.now());

    await announcement_and_rule.save();


    res.status(200).send({
        success: true,
        message: 'Announcement and rule deleted successfully',
        data: announcement_and_rule
    })

});

// Delete Announcement and rule image

exports.deleteAnnouncementAndRuleImage = catchAsync(async(req, res, next) => {

    let announcement_and_rule = await AnnouncementAndRule.findOne({_id: req.params.id, isDeleted: false});
    if(!announcement_and_rule) { 
        res.status(404).send({
            success: false,
            message: 'No Announcement and rule was found!',
            data: {}
        })  
        return
    }

    if(!announcement_and_rule.attachment) { 
        res.status(404).send({
            success: false,
            message: 'Announcement and rule does not include image!',
            data: {}
        })  
        return
    }
    
    let attachment = await Attachment.findOne({_id: announcement_and_rule.attachment});

    announcement_and_rule.attachment = null;
    attachment.url = null;
    attachment.isDeleted = true;
    attachment.deletedBy = req.decoded.id;

    await announcement_and_rule.save();
    await attachment.save();

    res.status(200).send({
        success: true,
        message: 'Image deleted successfully',
        data: announcement_and_rule
    })
});