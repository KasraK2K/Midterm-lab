const db = require('bootstrap/db');
const Schema = db.Schema;


const UserSchema = new Schema({
    name:       { type: String, required: true },
    email:      { type: String, required: true, unique: true },
    password:   { type: String, require: true },
    writer:     { type: Boolean, default: false },
    admin:      { type: Boolean, default: false },
    books:      [{ type: Schema.ObjectId, ref: 'Book' }]
}, {
    collation: 'users',
    timestamps: { type: Number, default: Date.now }
});


module.exports = db.model('User', UserSchema);
