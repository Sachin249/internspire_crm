var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');
var attendences = require('../../models/attendence')
var verifyToken = require('../../middleware/verifytokenuser');
var moment = require('moment-timezone');

router.get('/list',verifyToken, async function(req, res, next){
  try{
        const data = await attendences.find({userId:req.decoded.id}).populate('userId').exec();
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
    // let date = d.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" });
    let clockIn = d.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" });
    let date = moment().tz("Asia/Kolkata").format("DD/MM/YYYY");
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
    // let date = d.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" });
    let date = moment().tz("Asia/Kolkata").format("DD/MM/YYYY");
    let clockOut = d.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" });
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

router.get('/todayAttendence',verifyToken, async function(req, res, next){
  try{
    const d = new Date();
    // let date = d.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" });
    let date = moment().tz("Asia/Kolkata").format("DD/MM/YYYY");
        const data = await attendences.find({userId:req.decoded.id,date:date}).populate('userId').exec();
        return res.status(200).json({ success:'Data found', data:data });
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});

router.get('/remove/:id',verifyToken, async function(req, res, next){
  let dataId= req.params.id;
try{
   const attendence = await attendences.findOneAndRemove({'_id':dataId,'userId':req.decoded.id})
   if(!attendence){
    return res.status(400).json({ errors: "Attendence not exits or you are not authorized to delete this." });
   }
   return res.status(200).json({ success:"Attendence Deleted" });
}
catch(err){
  return res.status(500).json({ errors: err });
}
});

module.exports = router;