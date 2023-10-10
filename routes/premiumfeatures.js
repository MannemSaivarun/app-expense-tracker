const express = require('express');
const router = express.Router();

const premiumControllers = require("../controllers/premiumfeatures");
const Authorization = require("../middlewares/Auth");

router.get('/leaderboard' ,Authorization.authenticate ,premiumControllers.getUserLeaderboard);

module.exports = router;