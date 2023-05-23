var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const saltRounds = 10;
const { body, validationResult } = require('express-validator');
var users = require('../models/user')
var verifyToken = require('../middleware/verifytokenuser');

router.post('/postlogin', 
body('email').not().isEmpty().withMessage('email Required'), 
body('password').not().isEmpty().withMessage('password Required'), 
async function(req, res, next){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(500).json({ errors: errors.array() });
  }

  try{
    const user = await users.findOne({email:req.body.email})
    if(!user){
        res.status(500).json({
          message: 'Login Failed, Invalid Email or Invalid Password'
      });
    }
    let token = jwt.sign({ id: user._id,name: user.name}, global.config.usersecretKey, {
      algorithm: global.config.algorithm,
      expiresIn: '7d'
  });
  const updateData= await users.findOneAndUpdate({'_id':user._id}, {'remember_token':token,});
  res.status(200).json({
    message: 'Login Successful',
    jwtoken: token,
    data:user
  });
  console.log(req.body)
  }
  catch(err){
    console.log(err)
    res.status(500).json({
      message: 'Login Failed, Invalid Password'
    });
  }
  
  
});

router.post('/demo', 
body('name').not().isEmpty().withMessage('name Required'),
verifyToken,
 async function(req, res, next){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  console.log(req.body.name)
  return res.status(200).json({ message: 'its working'});
});

module.exports = router;