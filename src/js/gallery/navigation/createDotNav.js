'use strict';


var createNavItem = function createNavItem( innerText, method, argument ) {
	var link = document.createElement( 'a' );
	link.className = 'dot-nav-link';
	link.setAttribute( 'data-gallery-method', method );
	link.setAttribute( 'data-gallery-argument', argument );
	link.href = '#' + method + '-' + argument;

	var span = document.createElement( 'span' );
	span.className = 'dot-nav-link-text';
	span.innerText = innerText;
	link.appendChild(span);

	return link;
};


module.exports = function createDotNav( wrapper, images ) {
	var frag = document.createDocumentFragment();

	for ( var i = 0; i < images.length; i += 1 ) {
		var image = images[i];
		var element = createNavItem( image.alt, 'show', i );
		frag.appendChild( element );
	}

	var nav = document.createElement( 'nav' );
	nav.className = 'dot-nav';
	nav.appendChild( frag );

	return wrapper.appendChild( nav );
};
