const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const TaskSchema = new mongoose.Schema({
    employeeId:{
        type:String,
        ref:'users',
        required:false
    },
    description:{
        type:String,
        required:false
    },
    duedate:{
        type:String,
        required:false
    },
    leadId:{
        type:Array,
        ref:'leads',
        required:false
    },
    status:{
        type:String,
        default: 'Incomplete',
        required:false
    },
    userId:{
        type:String,
        ref:'users',
        required:false
    }
});

TaskSchema.set('timestamps', true);
TaskSchema.plugin(uniqueValidator);
module.exports = mongoose.model('tasks',TaskSchema,'tasks');