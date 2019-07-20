const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.render('index', {title: 'index'});
});

// User Router
const userRoute = require('./UserRoutes');
router.use('/user', userRoute);

// Book Router
const bookRoute = require('./BookRoutes');
router.use('/book', bookRoute);


module.exports = router;
