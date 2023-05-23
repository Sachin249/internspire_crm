const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const Email = require('mongoose-type-mail');

const LeadSchema = new mongoose.Schema({
    name:{
        type:String,
        required:false
    },
    email:{
        type:Email,
        required:false
    },
    contact:{
        type:String,
        required:false
    },
    qualification:{
        type:String,
        required:false
    },
    interestedFor:{
        type:String,
        required:false
    },
    industry:{
        type:String,
        required:false
    },
    mode:{
        type:String,
        required:false
    },
    reference:{
        type:String,
        required:false
    },
    location:{
        type:String,
        required:false
    },
    assign_to:{
        type:String,
        required:false
    },
    assign_by:{
        type:String,
        required:false
    },
    enrollment:{
        type:String,
        default: "Not Enrolled",
        required:false
    },
    status:{
        type:String,
        default: 'Open',
        required:false
    },
    notification:{
        type:Number,
        default: 0,
        required:false
    },
    userId:{
        type:String,
        ref:'users',
        required:false
    }
});

LeadSchema.set('timestamps', true);
LeadSchema.plugin(uniqueValidator);
module.exports = mongoose.model('leads',LeadSchema,'leads');