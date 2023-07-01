var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const saltRounds = 10;
const { body, validationResult } = require('express-validator');
var users = require('../../models/user')
var leads = require('../../models/lead')
var verifyToken = require('../../middleware/verifytokenuser');


router.get('/list',verifyToken, async function(req, res, next){
  try{
        const data = await leads.find().exec();
        return res.status(200).json({ success:'Data found', data:data });
  }catch(err){
    return res.status(500).json({ errors: err });
  }
});

router.post('/create-lead', 
verifyToken,
 async function(req, res, next){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // console.log(req.body)
  try{
    const saveLead = new leads({
      name:req.body.name,
      email:req.body.email,
      contact:req.body.contact,
      qualification:req.body.qualification,
      interestedFor:req.body.interestedFor,
      industry:req.body.industry,
      mode:req.body.mode,
      reference:req.body.reference,
      location:req.body.location,
      userId:req.decoded.id
    })
  
    const isLeadSave = await saveLead.save()
    return res.status(200).json({ success: 'Lead Created'});
    
  }
  catch(err){
    return res.status(500).json({ errors: err });
  }
  
  
});

router.post('/update-lead/:id', 
verifyToken,
 async function(req, res, next){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try{
    const id = req.params.id;
    const lead = await leads.findById(id)

    if(!lead){
      return res.status(400).json({ errors: "Lead Not Found" });
    }
    const data = await leads.findByIdAndUpdate(id,{
      "name":req.body.name,
      "email":req.body.email,
      "contact":req.body.contact,
      "qualification":req.body.qualification,
      "interestedFor":req.body.interestedFor,
      "industry":req.body.industry,
      "mode":req.body.mode,
      "status":req.body.status,
      "enrollment":req.body.enrollment,
      "reference":req.body.reference,
      "location":req.body.location,
     });
    
     const newdata = await leads.findById(id);
     return res.status(200).json({ success:'Lead Updated',data:newdata });
  }
  catch(err){
    return res.status(500).json({ errors: err });
  }
  
});

router.get('/show/:id',verifyToken, async function(req, res, next){
  let dataId= req.params.id;
  try{
    const data = await leads.findOne({'_id':dataId}).populate('assign_to').exec();
    return res.status(200).json({ data:data });
  }catch(err){
  return res.status(500).json({ errors: err });
  }
});

router.get('/remove/:id',verifyToken, async function(req, res, next){
  let dataId= req.params.id;
try{
   const lead = await leads.findOneAndRemove({'_id':dataId,'userId':req.decoded.id})
   if(!lead){
    return res.status(400).json({ errors: "Lead not exits or you are not authorized to delete this." });
   }
   return res.status(200).json({ success:"Lead Deleted" });
}
catch(err){
  return res.status(500).json({ errors: err });
}
});


module.exports = router;