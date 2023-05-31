var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const saltRounds = 10;
const { body, validationResult } = require('express-validator');
var users = require('../../models/user')
var attendences = require('../../models/attendence')
var verifyToken = require('../../middleware/verifytokenuser');


router.get('/list',verifyToken, async function(req, res, next){
  try{
        const data = await attendences.find().populate('userId').exec();
        return res.status(200).json({ success:'Data found', data:data });
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});

router.post('/create',  
body('from').not().isEmpty().withMessage('from Required'), 
verifyToken,
 async function(req, res, next){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try{
    const d = new Date();
    let date = d.toLocaleDateString();
    let clockIn = d.toLocaleTimeString();
    // const isValid = await attendences.findOne({date:date,userId:req.decoded.id})
    // if(isValid !== ''){
    //     return res.status(422).json({ error: 'Something went wrong'});
    // }
    const saveAttendence = new attendences({
      from:req.body.from,
      date: date,
      clockIn:clockIn,
      userId:req.decoded.id
    })
  
    const issaveAttendence = await saveAttendence.save()
    return res.status(200).json({ success: 'Attendence saved successfully'});
    
  }
  catch(err){
    return res.status(500).json({ errors: err });
  }
  
});

router.get('/clockout',
verifyToken,
 async function(req, res, next){
  
  try{
    const d = new Date();
    let date = d.toLocaleDateString();
    let clockOut = d.toLocaleTimeString();
    // const isValid = await attendences.find({date:date,userId:req.decoded.id,clockOut:{$ne:''}})
    // if(isValid){
    //     return res.status(422).json({ error: 'Something went wrong'});
    // }

    const updated = await attendences.updateOne({
        date:date,userId:req.decoded.id,clockOut:''
    },
    {
        clockOut : clockOut
    })
    return res.status(200).json({ success: 'Attendence saved successfully'});
    
  }
  catch(err){
    return res.status(500).json({ errors: err });
  }
  
});

module.exports = router;