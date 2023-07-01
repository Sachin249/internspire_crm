var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');
var users = require('../../models/user')
var verifyToken = require('../../middleware/verifytokenuser');


router.get('/getprofile',verifyToken, async function(req, res, next){
    try{
            const data = await users.find({"_id":req.decoded.id}).exec();
            return res.status(200).json({ success:'Data found', data:data });
    }catch(err){
        return res.status(500).json({ errors: err });
    }
});

router.post('/update/:id', 
verifyToken,
 async function(req, res, next){
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try{
    const id = req.params.id;
    const user = await users.findById(id)

    if(!user){
      return res.status(400).json({ errors: "Profile Not Found" });
    }
    const data = await users.findByIdAndUpdate(id,{
        name:req.body.name,
        phone:req.body.phone,
        gender:req.body.gender,
        password:req.body.password,
        address:req.body.address,
        image:req.body.image
     });
     if(!data){
        console.log('data no chlra')
     }
    
     const newdata = await users.findById(id);
     return res.status(200).json({ success:'Profile Updated',data:newdata });
    }
    catch(err){
        return res.status(500).json({ errors: err });
    }
  
});



module.exports = router;