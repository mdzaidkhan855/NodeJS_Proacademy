const express = require('express')
const {updatePassword,updateMe,deleteMe,getAllUsers} = require('./../Controllers/userController')
const{protect} = require('./../Controllers/authController')

const router = express.Router();

router.route('/getAllUsers').get(getAllUsers)
router.route('/updatePassword').patch(protect,updatePassword)
router.route('/updateMe').patch(protect,updateMe)
router.route('/deleteMe').delete(protect,deleteMe)

module.exports = router;