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
            const data = await users.find({"is_admin":0}).exec();
            return res.status(200).json({ success:'Data found', data:data });
    }catch(err){
        return res.status(500).json({ errors: err });
    }
});

router.post('/create', 
verifyToken,
 async function(req, res, next){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try{
    const saveUser = new users({
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        qualification:req.body.qualification,
        department:req.body.department,
        role:req.body.role,
        gender:req.body.gender,
        password:req.body.password,
        reference:req.body.reference,
        address:req.body.address
    })
  
    await saveUser.save()
    return res.status(200).json({ success: 'User Created'});
    
    }
    catch(err){
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
      return res.status(400).json({ errors: "User Not Found" });
    }
    const data = await users.findByIdAndUpdate(id,{
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        qualification:req.body.qualification,
        department:req.body.department,
        role:req.body.role,
        gender:req.body.gender,
        password:req.body.password,
        reference:req.body.reference,
        address:req.body.address
     });
    
     const newdata = await users.findById(id);
     return res.status(200).json({ success:'User Updated',data:newdata });
    }
    catch(err){
        return res.status(500).json({ errors: err });
    }
  
});

router.get('/show/:id',verifyToken, async function(req, res, next){
    let dataId= req.params.id;
    try{
      const data = await users.findOne({'_id':dataId}).exec();
      return res.status(200).json({ data:data });
    }catch(err){
    return res.status(500).json({ errors: err });
    }
  });

router.get('/remove/:id',verifyToken, async function(req, res, next){
    let dataId= req.params.id;
    try{
    const user = await users.findOneAndRemove({'_id':dataId})
    if(!user){
        return res.status(400).json({ errors: "User Not Exits" });
    }
    return res.status(200).json({ success:"User Deleted" });
    }
    catch(err){
    return res.status(500).json({ errors: err });
    }
});

router.get('/statusUpdate/:id',verifyToken, async function(req, res, next){
    let dataId= req.params.id;
    try{
    const viewDatas= await users.findOne({'_id':dataId}).exec();

        if(viewDatas){
        var statusKey= viewDatas.status;
        var newStatusKey='';
            if(statusKey == 'Active'){
                newStatusKey= 'Deactive';
            }else{
                newStatusKey= 'Active';
            }
            await users.findOneAndUpdate({'_id':dataId}, {'status':newStatusKey});
        }
        else{
            return res.status(400).json({ errors: "No Data Found" });
        }
        return res.status(200).json({ success:"Status Changed" });
    }
    catch(err){
        return res.status(500).json({ errors: err });
    }

});


module.exports = router;