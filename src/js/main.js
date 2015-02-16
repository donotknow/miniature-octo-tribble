'use strict';


var PHOTO_SET_ID = '72157639383517453';


var requestFlickrPhotoset = require( './flickr/requestPhotoset' );
var imagesDataToImgsFrag = require( './flickr/imagesDataToImgsFrag' );
var galleryBuilder = require( './gallery/builder' );


var Main = ( function() {
	return {

		initialize: function() {

			return requestFlickrPhotoset( PHOTO_SET_ID ).then( function( images ) {

				var wrapper = document.createElement( 'div' );
				wrapper.className = 'photobox';

				var div = document.createElement( 'div' );
				div.className = 'photos';
				wrapper.appendChild( div );

				var frag = imagesDataToImgsFrag( images );
				div.appendChild( frag );

				document.body.appendChild( wrapper );

				return galleryBuilder( wrapper, 'img' );

			}, function( error ) {
				throw error;
			} );

		}

	};
}() );


module.exports = Main.initialize();
