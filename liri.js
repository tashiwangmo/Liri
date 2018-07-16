require("dotenv").config();
var request = require("request");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var keys = require("./keys")
var fs = require("fs")

var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);

var liri = process.argv[2]

switch(liri){
    case "my-tweets":
    myTweets();
    break;
    case "spotify-this-song":
    spotifySong();
    break;
    case "movie-this":
    movieThis();
    break;
    case "do-what-it-says":
    whatItSays();
    break;

    //If an unknown command is entered, then the following will be displayed.
    default: 
    console.log(
      'Unknown Command. Try one of the following:' +
      '\nmy-tweets' +
      '\nspotify-this-song <song title>' +
      '\nmovie-this <movie title>' +
      '\ndo-what-it-says\n'
    );
}
// -------------------

function myTweets(){
    // did not have enough time but 
    
    client.get('statuses/user_timeline', { screen_name: 'TashiWa88479855', count: '20'}, function (err, tweets, response) {
        if (!err) {
            console.log(tweets)
            for (var i = 0; i < tweets.length; i++) {
                var time = tweets[i].created_at;
                var text = tweets[i].text;
                console.log('Posted At: ' + time + '    ' + 'Post Content: ' + text);
            }
        }
        else {
            console.log('Error Occured:\n' + err);
        }
    });
}
// -------------------------

function spotifySong(song){
    var song = process.argv[3];
    //Pseudocode:if statement to Define a default search if the user does not enter a movie title.
    // if(!song) {
    //     song = '"The sign"';
    //   };

      spotify.search({ type: 'track', query: song, limit: 20 }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        
        var artists = data.tracks.items[0].artists

        for(var i=0; i<artists.length; i++) {
          console.log("Artist(s): " + artists[i].name);
        };

        console.log("Song name: " + data.tracks.items[0].name);
        console.log("Preview: " + data.tracks.items[0].preview_url); 
        console.log("Album: " + data.tracks.items[0].album.name);
      });
}

function movieThis(movieName){
    
    var movieName = "";
//Pseudocode:if statement to define a default search if the user does not enter a movie title.
    // if (!movieName) {
    //     movieName = "Mr. Nobody";
    // };

    var nodeArgs = process.argv;
    for (var i = 3; i < nodeArgs.length; i++) {

        if (i > 3 && i < nodeArgs.length) {
          movieName = movieName + "+" + nodeArgs[i];
        }
        else {
          movieName += nodeArgs[i];
        }
      }
    
var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

request(queryUrl, function(error, response, body) {

  // If the request is successful
  if (!error && response.statusCode === 200) {
    console.log("Title: " + JSON.parse(body).Title);
    console.log("Release Year: " + JSON.parse(body).Year);
    console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
    console.log("Country: " + JSON.parse(body).Country);
    console.log("Language: " + JSON.parse(body).Language);
    console.log("Plot: " + JSON.parse(body).Plot);
    console.log("Actors: " + JSON.parse(body).Actors);
  }
});
}

function whatItSays(){
    var textArray;
    fs.readFile("random.txt", "utf8", (err, data) => {
        if (err) throw err;
        else {
            textArray = data.split(","); 
           
            //If the command in random.txt is "my-tweets" this will be false
            if (textArray.length > 1) { 
                //Remove quotation marks around search term in random.txt
                textArray[1] = textArray[1].trim().substring(1, textArray[1].trim().length - 1); 
            }
        
            console.log(textArray[1])
// todo: using the textArray values not only as parameter to call on different functions but also to take the value and run it as the inputed variables.
            switch (textArray[0]) {
                case "my-tweets":
                    myTweets();
                    break;

                case "spotify-this-song":
                spotifySong(textArray[1]);
                    break;

                case "movie-this":
                movieThis(textArray[1]);
                    break;
            }
        }
    });
}
