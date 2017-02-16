// JS Code for LIRI Bot, created by Connor Hoy in tandem with Austin I. With much of it being pulled from sources and documentation.

// Requires NPM packages needed for this project.
var fs = require('fs');
var twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');

// Requires key.
var keys = require('./keys.js');

// Beginning of Twitter code.
var app = {
  "my-tweets": function() {
    var client = twitter(keys.twitterKeys);
    client.get('statuses/user_timeline', function(error, tweetData, response) {
      if (!error) {
        console.log(' ');
        console.log('================ My Tweets ================');
        tweetData.forEach(function(obj) {
          console.log('--------------------------');
          console.log('Time: ' + obj.created_at);
          console.log('Tweet: ' + obj.text);
          console.log('--------------------------');
          console.log(' ');
        });
        console.log('===========================================');
        console.log(' ');
        // console.log(tweets);

        app.logData(tweetData);
      } else {
        console.log(error);
      }
    });
  },

// Beginning of Spotify code.
  "spotify-this-song": function(keyword) {
    spotify.search({ type: 'track', query: keyword || 'The Sign Ace of Base' }, function(err, data) {
      if ( err ) {
        console.log('An error occurred: ' + err);
        return;
      }

      if(data.tracks.items.length > 0) {
        var record = data.tracks.items[0];

        console.log(' ');
        console.log('================ Song Info ================');
        console.log('Artist: ' + record.artists[0].name);
        console.log('Name: ' + record.name);
        console.log('Link: ' + record.preview_url);
        console.log('Album: ' + record.album.name);
        console.log('===========================================');
        console.log(' ');

        app.logData(data);
      } else {
        console.log('No song data found.');
      }



    });
  },

// Beginnning of movie code.
  "movie-this": function(query) {
    request('http://www.omdbapi.com/?t=' + (query || 'Mr.Nobody') +'&tomatoes=true', function (error, response, info) {
      if (!error && response.statusCode == 200) {

        var movieData = JSON.parse(info);

        console.log(' ');
        console.log('================ Movie Info ================');
        console.log('Title: ' + movieData.Title);
        console.log('Year: ' + movieData.Year);
        console.log('IMDB Rating: ' + movieData.imdbRating);
        console.log('Country: ' + movieData.Country);
        console.log('Language: ' + movieData.Language);
        console.log('Plot: ' + movieData.Plot);
        console.log('Actors: ' + movieData.Actors);
        console.log('Rotten Tomatoes Rating: ' + movieData.tomatoRating);
        console.log('Rotten Tomatoes URL: ' + movieData.tomatoURL);
        console.log('===========================================');
        console.log(' ');

        app.logData(movieData);
      }
    });
  },

// Beginning of 'do what it says' code.
  "do-what-it-says": function() {
    fs.readFile('random.txt', 'utf8', function(err, data) {
      if(err) throw err;
      console.log(data.toString());

      var cmds = data.toString().split(',');

      app[cmds[0].trim()](cmds[1].trim());
    });
  },

// Logs everything out to log.txt, in JSON stringify form.
  logData: function(data) {
    fs.appendFile('log.txt', JSON.stringify(data, null, 2) + '\n====================================================================================', function(err) {
      if(err) {
        console.log(err);
      }
    });
  }
};

app[process.argv[2]](process.argv[3]);