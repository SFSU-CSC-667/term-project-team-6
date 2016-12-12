const express = require('express');
const router = express.Router();

/* GET connections listing. */
router.get('/', function(req, res, next) {
    res.render("chat", { title : "Chat page", action: "draw"});
});

module.exports = router;