'use strict';


var eventEmitter = require( 'event-emitter' );


function Gallery( wrapper, imageSelector ) {

	// return if we haven't provided a valid element wrapper
	if ( !wrapper || wrapper.nodeType !== Node.ELEMENT_NODE ) {
		return false;
	}

	// return if we don't have any images for the gallery
	this.images = wrapper.querySelectorAll( imageSelector );
	if ( !this.images || this.images.length < 1 ) {
		return false;
	}

	// let's tell the CSS we've initialized
	wrapper.classList.add( 'gallery' );

	return this;
}


var proto = Gallery.prototype = Object.create( eventEmitter() );


Object.defineProperty( proto, 'currentImage', {

	get: function() {
		return this._currentImage;
	},

	set: function( image ) {

		// whenever we set a current image, we should also remove the
		// className “current” from the previous image
		var previousImage = this._currentImage;
		if ( previousImage ) {
			previousImage.classList.remove( 'current' );
		}

		// add the className “current” to this image, so we can have
		// the css react to it
		image.classList.add( 'current' );

		this._currentImage = image;
		return this._currentImage;
	}

} );


proto.getCurrentImageIndex = function getCurrentImageIndex( id ) {
	return Array.prototype.indexOf.call( this.images, this.currentImage );
};


proto.getPreviousIndex = function getPreviousIndex() {
	var index = this.getCurrentImageIndex() - 1;

	if (index < 0) {
		return false;
	}

	return index;
};


proto.getNextIndex = function getNextIndex() {
	var index = this.getCurrentImageIndex() + 1;

	if (index > this.images.length) {
		return false;
	}

	return index;
};


proto.getPrevious = function getPrevious() {
	return this.images[ this.getPreviousIndex() ] || false;
};


proto.getNext = function getNext() {
	return this.images[ this.getNextIndex() ] || false;
};


proto.show = function show( image ) {
	if ( this.images[image] ) {
		this.currentImage = this.images[image];
	} else if ( Array.prototype.indexOf.call( this.images, image ) > -1) {
		this.currentImage = image;
	}

	// trigger an event for any observers
	this.emit( 'show', this );
};


proto.showPrevious = function showPrevious( id ) {
	this.show( this.getPrevious() );
};


proto.showNext = function showNext() {
	this.show( this.getNext() );
};


module.exports = Gallery;
