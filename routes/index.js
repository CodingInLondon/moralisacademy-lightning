var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Test store landing page', message: 'this is a message' });
});

module.exports = router;
