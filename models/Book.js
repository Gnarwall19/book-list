const mongoose = require('mongoose');

var Book = mongoose.model('Book', {
    title: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    author: {
        type: String,
        required: false,
        minLength: 1,
        trim: true
    },
    reading: {
        type: Boolean,
        default: false
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: String,
        default: null
    }
});

module.exports = {
    Book
};