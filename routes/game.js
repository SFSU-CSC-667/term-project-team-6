const express = require('express');
const router = express.Router();

/* GET connections listing. */
router.get('/', function(req, res, next) {
    res.render("game2", { title : "Game page"});
});

module.exports = router;