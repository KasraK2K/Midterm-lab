const db = require('bootstrap/db');
const Schema = db.Schema;


const BookSchema = new Schema({
    title:          {type: String, required: true},
    description:    {type: String, required: true},
    writer:         {type: String, required: true},
    count:          { type: Number, default: 0},
}, {
    collation: 'books',
    timestamps: true
});


module.exports = db.model('Book', BookSchema);
