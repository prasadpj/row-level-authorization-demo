const mongoose = require('mongoose');
const Movie = require('./../schema/movie.model').Movie;
const fs = require('fs');
const async = require('async');
const config = require('./../config/index');

mongoose.connect(config.mongo.host, { useNewUrlParser: true }, (err) => {
    if (err) {
        console.log("cannot connect to mongoose ",err);
        process.exit(0);
    }
    ingestMovies();
});

const ingestMovies = () => {
    fs.readFile('./imdb.json', 'utf-8', (err, data) => {
        if (err) {
            console.log("Error while reading the file", err);
            return;
        }
        movieList = JSON.parse(data);
        // console.log('movieList ',movieList)
        async.forEach(movieList, (movie, callback) => {
            let mongoObj = new Movie(movie);
            mongoObj.save((err) => {
                if (err)
                    console.log("error ",err);
                else
                    console.log("inserted");
                callback();
            })
        }, (err) => {
            if(err)
                console.error('err ',err)
            console.log("done");
            process.exit(0);
        })
    })
}