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



module.exports = router;