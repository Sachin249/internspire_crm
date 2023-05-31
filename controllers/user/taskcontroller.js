var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const saltRounds = 10;
const { body, validationResult } = require('express-validator');
var tasks = require('../../models/task')
var leads = require('../../models/lead')
var attendences = require('../../models/attendence')
var verifyToken = require('../../middleware/verifytokenuser');


router.get('/list',verifyToken, async function(req, res, next){
  try{
        const data = await tasks.find({employeeId:req.decoded.id}).populate('userId').populate('employeeId').populate('leadId').exec();
        return res.status(200).json({ success:'Data found', data:data });
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});


router.get('/statusUpdate/:id',verifyToken, async function(req, res, next){
  let dataId= req.params.id;
  try{
  const viewDatas= await tasks.findOne({'_id':dataId}).exec();

      if(viewDatas){
      var statusKey= viewDatas.status;
      var newStatusKey='';
          if(statusKey == 'Incomplete'){
              newStatusKey= 'Completed';
          }else{
              newStatusKey= 'Incomplete';
          }
          await tasks.findOneAndUpdate({'_id':dataId}, {'status':newStatusKey});
      }
      else{
          return res.status(400).json({ errors: "No Data Found" });
      }
      return res.status(200).json({ success:"Status updated" });
  }
  catch(err){
      return res.status(500).json({ errors: err });
  }

});


module.exports = router;