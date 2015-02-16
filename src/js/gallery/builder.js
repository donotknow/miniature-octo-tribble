'use strict';


var Gallery = require( './Gallery' );
var KeyboardController = require( './controller/Keyboard' );
var LinkController = require( './controller/Link' );

var LinkPainterObserver = require( './observer/LinkPainter' );

var createArrowNav = require( './navigation/createArrowNav' );
var createDotNav = require( './navigation/createDotNav' );


module.exports = function builder( wrapper, imageSelector ) {

	var gallery = new Gallery( wrapper, imageSelector );

	var controllers = {
		keyboard: new KeyboardController( gallery ),
		link: new LinkController( gallery, '*[data-gallery-method]' )
	};

	createArrowNav( wrapper );
	createDotNav( wrapper, gallery.images );

	var observers = {

		previousLink: new LinkPainterObserver(gallery, {
			className: 'disabled',
			linksToPaint: function () {
				return wrapper.querySelectorAll('*[data-gallery-method="showPrevious"]')
			},
			linksToUnPaint: function () {
				return wrapper.querySelectorAll('*.disabled[data-gallery-method="showPrevious"]')
			},
			shouldPaint: function() {
				return ( gallery.getPrevious() === false );
			}
		} ),

		nextLink: new LinkPainterObserver(gallery, {
			className: 'disabled',
			linksToPaint: function () {
				return wrapper.querySelectorAll('*[data-gallery-method="showNext"]')
			},
			linksToUnPaint: function () {
				return wrapper.querySelectorAll('*.disabled[data-gallery-method="showNext"]')
			},
			shouldPaint: function() {
				return ( gallery.getNext() === false );
			}
		} ),

		imageLink: new LinkPainterObserver(gallery, {
			className: 'current',
			linksToPaint: function () {
				return wrapper.querySelectorAll('a[data-gallery-method="show"][data-gallery-argument="' + gallery.getCurrentImageIndex() + '"]')
			},
			linksToUnPaint: function () {
				return wrapper.querySelectorAll('a[data-gallery-method="show"][data-gallery-argument]')
			},
			shouldPaint: function() {
				return true;
			}
		} )
	};

	// since we are just initializing this gallery, let's show the first image
	gallery.show( 0 );

	window.gallery = gallery;
	return gallery;

};
