const mongoose = require('mongoose');


const uri = `mongodb://127.0.0.1:27017/midtermLib`;
mongoose.Promise = global.Promise;
mongoose
    .connect(uri, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    .then(() => {
        console.log('Connection Successful');
    })
    .catch(err => {
        console.log('Error on Connecting Database\n', err);
    });


module.exports = mongoose;
