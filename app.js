require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: 'f4bdc659bac44d89a7f3bc64299ac546',
  clientSecret: '05e045d10b1949b0a4ff8425e72f73b4',
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));
 
// Our routes go here:

// Home

app.get ("/",(req,res,next) => {
    res.render("home");
})

// Artist
app.get ("/artist-search-result",(req,res,next) => {
    spotifyApi
    .searchArtists(req.query.search)
    .then(data=> {

        console.log(data.body.artists)
        res.render ("artist-search-result", {artists: data.body.artists})
    })
    .catch(err => console.log("The error while searching artists occurred:", err));
})

// Album
app.get ("/albums/:artistId", (req,res,next) => {
    spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(album=> {
        res.render ("albums", album.body);
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

// Tracks
app.get ("/tracks/:albumId", (req,res,next) => {
    spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then(track=> {
        console.log(track.body.items)
        res.render ("tracks", track.body);
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})


  


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));