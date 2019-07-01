require("dotenv").config();
var keys = require("./keys.js");
var axios = require('axios');
var fs = require("fs");
var moment = require('moment');
moment().format();

var command = process.argv[2];
var input = process.argv.slice(3);

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var divider = "\n------------------------------------------------------------\n\n";

function searchSpotify() {
    var song = "";

    if (!input) {
        song = "Here Comes the Sun"
    } else {
        song = input.join(" ");
    }

    spotify.search({ type: 'track', query: song, limit: 5 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var songs = data.tracks.items;

        for (var i = 0; i < songs.length; i++) {
            var currentSong = songs[i];
            // var artistsArray = [];
            var artists = [];

            for (var j = 0; j < currentSong.artists.length; j++) {
                artists.push(currentSong.artists[j].name);
            };


            var showData = [
                `Artist(s): ${artists.join(", ")}`,
                //   The song's name
                `Song Title: ${songs[i].name}`,
                //   A preview link of the song from Spotify
                `Preview Song on Spotify: ${songs[i].preview_url}`,
                //   The album that the song is from
                `Featured on the Album: ${songs[i].album.name}`,
                divider

            ].join("\n\n");

            console.log(showData);

            fs.appendFile("log.txt", showData, function (err) {
                if (err) throw err;
            });

        };

    });
}


function searchOmdb() {

    var movie = "";

    if (!input) {
        movie = "Finding+Nemo";
    } else {
        movie = input.join("+");
    }

    axios.get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy").then(
        function (response) {
            //   console.log(response.data);
            var showData = [
                `Title: ${response.data.Title}`,
                //   * Year the movie came out.
                `Year Released: ${response.data.Year}`,
                //   * IMDB Rating of the movie.
                `IMDB Rating: ${response.data.imdbRating}`,
                //   * Rotten Tomatoes Rating of the movie.

                ` Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}`,
                //   * Country where the movie was produced.
                `Produced in: ${response.data.Country}`,
                //   * Language of the movie.
                `Language: ${response.data.Language}`,
                //   * Plot of the movie.
                `Plot: ${response.data.Plot}`,
                //   * Actors in the movie.
                `Actors: ${response.data.Actors}`,
                divider

            ].join("\n\n");

            fs.appendFile("log.txt", showData, function (err) {
                if (err) throw err;
                console.log(showData);
            });

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

function concertThis() {

    var artist = "";
    var artistTitle = "";

    if (!input) {
        artist = "Ed%20Sheeran";
        artistTitle = `ED SHEERAN'S UPCOMING CONCERTS:\n\n`;
    } else {
        artist = input.join("%20");
        artistTitle = `${input.join(" ").toUpperCase()}'S UPCOMING CONCERTS:\n\n`;
    }

    fs.appendFile("log.txt", artistTitle, function (err) {
        if (err) throw err;
        console.log(artistTitle);
    });

    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp").then(
        function (response) {
            response.data.forEach(function (concert) {
                var originalDate = moment(concert.datetime, "YYYY-MM-DDTHH:mm:ss");
                var dateReformatted = originalDate.format("MM/DD/YY");
                var city = "";

                if (!concert.venue.region) {
                    city = `City: ${concert.venue.city}, ${concert.venue.country}`;
                } else {
                    city = `City: ${concert.venue.city}, ${concert.venue.region}, ${concert.venue.country}`;
                };

                var showData = [
                    // Name of the venue
                    `Venue: ${concert.venue.name}`,
                    // Venue location
                    city,
                    // Date of the Event (use moment to format this as "MM/DD/YYYY")
                    `Date: ${dateReformatted}`,
                    divider
                ].join("\n\n");

                fs.appendFile("log.txt", showData, function (err) {
                    if (err) throw err;
                    console.log(showData);
                });
            });

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
        runCommands();
    });
}

function runCommands() {
    switch (command) {
        case "concert-this":
            return concertThis();
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