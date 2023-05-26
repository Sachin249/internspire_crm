const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const AttendenceSchema = new mongoose.Schema({
    from:{
        type:String,
        required:true
    },
    clockIn:{
        type:String,
        required:true
    },
    clockOut:{
        type:String,
        default: '',
        required:false
    },
    date:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default: 'Present',
        required:false
    },
    userId:{
        type:String,
        ref:'users',
        required:false
    }
});

AttendenceSchema.set('timestamps', true);
AttendenceSchema.plugin(uniqueValidator);
module.exports = mongoose.model('attendences',AttendenceSchema,'attendences');