const mongoose = require('mongoose');

let User = mongoose.model('Users', {
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }
});

module.exports = {
    User
};