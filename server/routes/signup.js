const express = require('express');
const { SignupUser } = require('../controllers/signup');

const router = express.Router();

router.post("/", SignupUser);


module.exports = router;