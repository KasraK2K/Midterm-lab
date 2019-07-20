const express = require('express');
const router = express.Router();


// Middleware
const RedirectIfAuthenticated = require('middleware/RedirectIfAuthenticated');
const RedirectNotAuthenticated = require('middleware/RedirectNotAuthenticated');

// Controllers
const BookController = require('controller/BookController');

router.route('/')
    .get(BookController.showAllBooks); // Show All Books

router.route('/create')
    .get(BookController.showCreateBook)
    .post(BookController.createBook); // Create Book

// Get Single Book Info
router.route('/:id')
    .get(BookController.getBook) // Get Single Book Info
    .put(BookController.updateBook); // Book Update


module.exports = router;
