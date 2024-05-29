const express = require('express')
const{signup,login,forgotPassword,resetPassword,updatePassword,protect} = require('./../Controllers/authController')
const router = express.Router();

router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/forgotPassword').post(forgotPassword)
router.route('/resetPassword/:token').patch(resetPassword)

router.route('/updatePassword').patch(protect,updatePassword)

module.exports = router;