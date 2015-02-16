'use strict';


var KeyboardController = function KeyboardController( gallery ) {

	// we can't do anything without a proper gallery
	if ( !gallery || typeof gallery.showPrevious !== 'function' || typeof gallery.showPrevious !== 'function' ) {
		return false;
	}

	this.gallery = gallery;

	document.addEventListener( 'keydown', this.handleKeydown.bind( this ), false );

	return this;
};


var proto = KeyboardController.prototype;


proto.handleKeydown = function ( event ) {
	var keyCode = event.which;

	if ( typeof this[keyCode] === 'function' ) {
		this[keyCode]( event );
	}
};


// LEFT ARROW
proto[37] = function ( event ) {
	this.gallery.showPrevious();
};


// RIGHT ARROW
proto[39] = function ( event ) {
	this.gallery.showNext();
};


module.exports = KeyboardController;
