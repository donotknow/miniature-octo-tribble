'use strict';


var LinkPainterObserver = function LinkPainterObserver( gallery, options ) {
	// we can't do anything without a proper gallery
	
	if ( !gallery ) {
		return false;
	}

	this.gallery = gallery;

	options = options || {};

	// map the passed options to this
	for ( var option in options ) {
		this[option] = options[option];
	}

	// we also can't do anything without…
	if ( !options.className || !options.linksToPaint || typeof options.shouldPaint !== 'function' ) {
		return false;
	}

	this.gallery.on( 'show', this.handleShow.bind( this ) );

	return this;
};


var proto = LinkPainterObserver.prototype;


proto.unPaintLinks = function unPaintLinks() {
	var links = this.linksToUnPaint();
	for ( var i = 0; i < links.length; i += 1 ) {
		links[i].classList.remove( this.className );
	}
};


proto.paintLinks = function ( ) {
	var links = this.linksToPaint();
	for ( var i = 0; i < links.length; i += 1 ) {
		links[i].classList.add( this.className );
	}
};


proto.handleShow = function ( image ) {
	this.unPaintLinks();

	if ( this.shouldPaint() ) {
		this.paintLinks();
	}
};


module.exports = LinkPainterObserver;
