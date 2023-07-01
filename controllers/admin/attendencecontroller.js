var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const saltRounds = 10;
const { body, validationResult } = require('express-validator');
var attendences = require('../../models/attendence')
var verifyToken = require('../../middleware/verifytokenuser');


router.post('/todayattendencelist',verifyToken, async function(req, res, next){
  try{
    
    // const d = new Date();
    let getdate= req.body.date;
    // let date = d.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" });
        const data = await attendences.find({'date':getdate}).populate('userId').exec();
        return res.status(200).json({ success:'Data found', data:data });
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});

router.get('/remove/:id',verifyToken, async function(req, res, next){
  let dataId= req.params.id;
try{
   const attendence = await attendences.findOneAndRemove({'_id':dataId})
   if(!attendence){
    return res.status(400).json({ errors: "Attendence not Exits" });
   }
   return res.status(200).json({ success:"Attendence Deleted" });
}
catch(err){
  return res.status(500).json({ errors: err });
}
});

router.get('/statusUpdate/:id',verifyToken, async function(req, res, next){
    let dataId= req.params.id;
    try{
    const viewDatas= await attendences.findOne({'_id':dataId}).exec();
        if(viewDatas){
        var statusKey= viewDatas.status;
        var newStatusKey='';
            if(statusKey == 'Present'){
                newStatusKey= 'Absent';
            }else{
                newStatusKey= 'Present';
            }
            await attendences.findOneAndUpdate({'_id':dataId}, {'status':newStatusKey});
        }
        else{
            return res.status(400).json({ errors: "No Data Found" });
        }
        return res.status(200).json({ success:"Status Updated" });
    }
    catch(err){
        return res.status(500).json({ errors: err });
    }

});

module.exports = router;