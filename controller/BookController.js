const Controller = require('controller/Controller');
const Book = require('model/BookModel');


class BookController extends Controller {
    showAllBooks(req, res) {
        Book
            .find({})
            .select({ title: true, description: true, writer: true })
            .exec( function (err, book) {
                if (err) throw new Error(err);
                res.render('book', {
                    books: book,
                    title: 'Show All Books'
                });
            });
    };

    showCreateBook(req, res) {
        res.render('createBook', {
            title: 'Show Create Book Form'
        });
    };

    createBook(req, res) {
        const {title, description, writer, count } = req.body;
        if (title && description && writer) {
            let newBook = new Book(req.body);
            newBook
                .save()
                .then(book => {
                    res.redirect('/book');
                })
                .catch(err => {
                    res.status(500).send(err);
                    throw new Error(err);
                })
        } else {
            res.status(401).send('Data Incomplete');
        }
    };

    getBook(req, res) {
        const id = req.params.id;
        Book
            .findById(id)
            .then(book => {
                res.json(book);
            })
            .catch(err => {
                res.status(500).send(err);
                throw new Error(err);
            });
    };

    updateBook(req, res) {
        const id = req.params.id;
        const { title, description, writer, count } = req.body;
        if (title && description && writer) {
            Book
                .findByIdAndUpdate(id, {
                    title, description, writer, count
                })
                .then(book => {
                    res.json(book);
                })
                .catch(err => {
                    res.status(500).send(err);
                    throw new Error(err);
                });
        } else {
            res.status(401).send('Data Incomplete');
        }
    };
}


module.exports = new BookController();
