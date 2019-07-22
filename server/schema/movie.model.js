const mongoose = require('mongoose');

var Movie = mongoose.model('Movie', {
    name: { type: String },
    "99popularity": { type: Number },
    director: { type: String },
    genre: [],
    imdb_score: { type: Number },
    isDeleted: { type: Boolean, default: false },

    isModeratorAccess: { type: Boolean, default: false },
    isViewerAccess: { type: Boolean, default: false },
});

module.exports = { Movie };