'use strict';


var FLICKR_API = 'https://api.flickr.com/services/rest/';
var API_KEY = '5673c70353d5fd11300796cb8d72af89';


function apiUrl( id ) {
	var url = FLICKR_API + '?format=json&method=flickr.photosets.getPhotos';
	url += '&api_key=' + API_KEY;
	url += '&photoset_id=' + id;
	return url;
}


function createScript( id ) {
	var script = document.createElement( 'script' );
	script.src = apiUrl( id );
	return script;
}


module.exports = function requestPhotoset( id ) {

	return new Promise( function photosetPromise( resolve, reject ) {
		var script = createScript( id );

		// if we go wrong with the script tag, reject our promise
		script.onerror = reject;

		// flickr's jsonp api expects window.jsonFlickrApi to be the callback
		window.jsonFlickrApi = function( data ) {

			// if flickr api reports an error, reject the promise
			if ( data.stat !== 'ok' ) {
				reject( data.stat );
			}

			if ( !data.photoset && !data.photoset.photo && data.photoset.photo.length < 1 ) {
				reject( 'No photos returned for photoset with id ' + id  + '.' );
			}

			resolve( data.photoset.photo );

			// clean up the window after the jsonp call
			window.jsonFlickrApi = null;
			document.body.removeChild( script );
		};

		document.body.appendChild( script );
	} );

};
