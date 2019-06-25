require("dotenv").config();
var keys = require("./keys.js");
var axios = require('axios');
var fs = require("fs");
var command = process.argv[2];
var input = process.argv.slice(3);

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

function searchSpotify() {
    var song = input.join(" ");
    spotify.search({ type: 'track', query: song, limit: 2 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        //   console.log(data.tracks.items[0]); 
        //   Artist(s) --how to get multiple?
        console.log(`Artist(s): ${data.tracks.items[0].artists[0].name}`);
        //   The song's name
        console.log(`Song Title: ${data.tracks.items[0].name}`)
        //   A preview link of the song from Spotify
        console.log(`Preview Song on Spotify: ${data.tracks.items[0].preview_url}`)
        //   The album that the song is from
        console.log(`Featured on the Album: ${data.tracks.items[0].album.name}`)

    });
}


function searchOmdb() {
    var movie = input.join("+");
    axios.get("http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy").then(
        function (response) {
            //   console.log(response.data);
            //   * Title of the movie.
            console.log(`Title: ${response.data.Title}`);
            //   * Year the movie came out.
            console.log(`Year Released: ${response.data.Year}`);
            //   * IMDB Rating of the movie.
            console.log(`IMDB Rating: ${response.data.imdbRating}`);
            //   * Rotten Tomatoes Rating of the movie.

            console.log(` Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}`);
            //   * Country where the movie was produced.
            console.log(`Produced in: ${response.data.Country}`);
            //   * Language of the movie.
            console.log(`Language: ${response.data.Language}`);
            //   * Plot of the movie.
            console.log(`Plot: ${response.data.Plot}`);
            //   * Actors in the movie.
            console.log(`Actors: ${response.data.Actors}`);

        })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            console.log(error.config);
        });

}

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        var dataArray = data.split(",");
        command = dataArray[0];
        input = dataArray[1].split(" ");
        console.log(command);
        console.log(input);
        runCommands();
    });

}

function runCommands() {
    switch (command) {
        case "concert-this":
            break;
        case "spotify-this-song":
            return searchSpotify();
        case "movie-this":
            return searchOmdb();
        case "do-what-it-says":
            return doWhatItSays();
        default:
            return console.log("Please write a correct command for LIRI to help you");
    };
}

runCommands();