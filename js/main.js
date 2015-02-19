(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var d        = require('d')
  , callable = require('es5-ext/object/valid-callable')

  , apply = Function.prototype.apply, call = Function.prototype.call
  , create = Object.create, defineProperty = Object.defineProperty
  , defineProperties = Object.defineProperties
  , hasOwnProperty = Object.prototype.hasOwnProperty
  , descriptor = { configurable: true, enumerable: false, writable: true }

  , on, once, off, emit, methods, descriptors, base;

on = function (type, listener) {
	var data;

	callable(listener);

	if (!hasOwnProperty.call(this, '__ee__')) {
		data = descriptor.value = create(null);
		defineProperty(this, '__ee__', descriptor);
		descriptor.value = null;
	} else {
		data = this.__ee__;
	}
	if (!data[type]) data[type] = listener;
	else if (typeof data[type] === 'object') data[type].push(listener);
	else data[type] = [data[type], listener];

	return this;
};

once = function (type, listener) {
	var once, self;

	callable(listener);
	self = this;
	on.call(this, type, once = function () {
		off.call(self, type, once);
		apply.call(listener, this, arguments);
	});

	once.__eeOnceListener__ = listener;
	return this;
};

off = function (type, listener) {
	var data, listeners, candidate, i;

	callable(listener);

	if (!hasOwnProperty.call(this, '__ee__')) return this;
	data = this.__ee__;
	if (!data[type]) return this;
	listeners = data[type];

	if (typeof listeners === 'object') {
		for (i = 0; (candidate = listeners[i]); ++i) {
			if ((candidate === listener) ||
					(candidate.__eeOnceListener__ === listener)) {
				if (listeners.length === 2) data[type] = listeners[i ? 0 : 1];
				else listeners.splice(i, 1);
			}
		}
	} else {
		if ((listeners === listener) ||
				(listeners.__eeOnceListener__ === listener)) {
			delete data[type];
		}
	}

	return this;
};

emit = function (type) {
	var i, l, listener, listeners, args;

	if (!hasOwnProperty.call(this, '__ee__')) return;
	listeners = this.__ee__[type];
	if (!listeners) return;

	if (typeof listeners === 'object') {
		l = arguments.length;
		args = new Array(l - 1);
		for (i = 1; i < l; ++i) args[i - 1] = arguments[i];

		listeners = listeners.slice();
		for (i = 0; (listener = listeners[i]); ++i) {
			apply.call(listener, this, args);
		}
	} else {
		switch (arguments.length) {
		case 1:
			call.call(listeners, this);
			break;
		case 2:
			call.call(listeners, this, arguments[1]);
			break;
		case 3:
			call.call(listeners, this, arguments[1], arguments[2]);
			break;
		default:
			l = arguments.length;
			args = new Array(l - 1);
			for (i = 1; i < l; ++i) {
				args[i - 1] = arguments[i];
			}
			apply.call(listeners, this, args);
		}
	}
};

methods = {
	on: on,
	once: once,
	off: off,
	emit: emit
};

descriptors = {
	on: d(on),
	once: d(once),
	off: d(off),
	emit: d(emit)
};

base = defineProperties({}, descriptors);

module.exports = exports = function (o) {
	return (o == null) ? create(base) : defineProperties(Object(o), descriptors);
};
exports.methods = methods;

},{"d":2,"es5-ext/object/valid-callable":11}],2:[function(require,module,exports){
'use strict';

var assign        = require('es5-ext/object/assign')
  , normalizeOpts = require('es5-ext/object/normalize-options')
  , isCallable    = require('es5-ext/object/is-callable')
  , contains      = require('es5-ext/string/#/contains')

  , d;

d = module.exports = function (dscr, value/*, options*/) {
	var c, e, w, options, desc;
	if ((arguments.length < 2) || (typeof dscr !== 'string')) {
		options = value;
		value = dscr;
		dscr = null;
	} else {
		options = arguments[2];
	}
	if (dscr == null) {
		c = w = true;
		e = false;
	} else {
		c = contains.call(dscr, 'c');
		e = contains.call(dscr, 'e');
		w = contains.call(dscr, 'w');
	}

	desc = { value: value, configurable: c, enumerable: e, writable: w };
	return !options ? desc : assign(normalizeOpts(options), desc);
};

d.gs = function (dscr, get, set/*, options*/) {
	var c, e, options, desc;
	if (typeof dscr !== 'string') {
		options = set;
		set = get;
		get = dscr;
		dscr = null;
	} else {
		options = arguments[3];
	}
	if (get == null) {
		get = undefined;
	} else if (!isCallable(get)) {
		options = get;
		get = set = undefined;
	} else if (set == null) {
		set = undefined;
	} else if (!isCallable(set)) {
		options = set;
		set = undefined;
	}
	if (dscr == null) {
		c = true;
		e = false;
	} else {
		c = contains.call(dscr, 'c');
		e = contains.call(dscr, 'e');
	}

	desc = { get: get, set: set, configurable: c, enumerable: e };
	return !options ? desc : assign(normalizeOpts(options), desc);
};

},{"es5-ext/object/assign":3,"es5-ext/object/is-callable":6,"es5-ext/object/normalize-options":10,"es5-ext/string/#/contains":13}],3:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')()
	? Object.assign
	: require('./shim');

},{"./is-implemented":4,"./shim":5}],4:[function(require,module,exports){
'use strict';

module.exports = function () {
	var assign = Object.assign, obj;
	if (typeof assign !== 'function') return false;
	obj = { foo: 'raz' };
	assign(obj, { bar: 'dwa' }, { trzy: 'trzy' });
	return (obj.foo + obj.bar + obj.trzy) === 'razdwatrzy';
};

},{}],5:[function(require,module,exports){
'use strict';

var keys  = require('../keys')
  , value = require('../valid-value')

  , max = Math.max;

module.exports = function (dest, src/*, …srcn*/) {
	var error, i, l = max(arguments.length, 2), assign;
	dest = Object(value(dest));
	assign = function (key) {
		try { dest[key] = src[key]; } catch (e) {
			if (!error) error = e;
		}
	};
	for (i = 1; i < l; ++i) {
		src = arguments[i];
		keys(src).forEach(assign);
	}
	if (error !== undefined) throw error;
	return dest;
};

},{"../keys":7,"../valid-value":12}],6:[function(require,module,exports){
// Deprecated

'use strict';

module.exports = function (obj) { return typeof obj === 'function'; };

},{}],7:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')()
	? Object.keys
	: require('./shim');

},{"./is-implemented":8,"./shim":9}],8:[function(require,module,exports){
'use strict';

module.exports = function () {
	try {
		Object.keys('primitive');
		return true;
	} catch (e) { return false; }
};

},{}],9:[function(require,module,exports){
'use strict';

var keys = Object.keys;

module.exports = function (object) {
	return keys(object == null ? object : Object(object));
};

},{}],10:[function(require,module,exports){
'use strict';

var forEach = Array.prototype.forEach, create = Object.create;

var process = function (src, obj) {
	var key;
	for (key in src) obj[key] = src[key];
};

module.exports = function (options/*, …options*/) {
	var result = create(null);
	forEach.call(arguments, function (options) {
		if (options == null) return;
		process(Object(options), result);
	});
	return result;
};

},{}],11:[function(require,module,exports){
'use strict';

module.exports = function (fn) {
	if (typeof fn !== 'function') throw new TypeError(fn + " is not a function");
	return fn;
};

},{}],12:[function(require,module,exports){
'use strict';

module.exports = function (value) {
	if (value == null) throw new TypeError("Cannot use null or undefined");
	return value;
};

},{}],13:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')()
	? String.prototype.contains
	: require('./shim');

},{"./is-implemented":14,"./shim":15}],14:[function(require,module,exports){
'use strict';

var str = 'razdwatrzy';

module.exports = function () {
	if (typeof str.contains !== 'function') return false;
	return ((str.contains('dwa') === true) && (str.contains('foo') === false));
};

},{}],15:[function(require,module,exports){
'use strict';

var indexOf = String.prototype.indexOf;

module.exports = function (searchString/*, position*/) {
	return indexOf.call(this, searchString, arguments[1]) > -1;
};

},{}],16:[function(require,module,exports){
'use strict';


function imageSrcFromData( imageData ) {
	var url = 'https://farm' + imageData.farm + '.staticflickr.com/';
	url += imageData.server + '/';
	url += imageData.id + '_' + imageData.secret + '_b.jpg';
	return url;
}


module.exports = function imagesDataToImgsFrag( imagesData ) {
	var frag = document.createDocumentFragment();

	for ( var i = 0; i < imagesData.length; i++ ) {
		var imageData = imagesData[i];
		var img = new Image();
		img.src = imageSrcFromData( imageData );
		img.alt = imageData.title;
		frag.appendChild( img );
	}

	return frag;
};

},{}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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

	if ( index < 0 ) {
		return false;
	}

	return index;
};


proto.getNextIndex = function getNextIndex() {
	var index = this.getCurrentImageIndex() + 1;

	if ( index > this.images.length ) {
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
	} else if ( Array.prototype.indexOf.call( this.images, image ) > -1 ) {
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

},{"event-emitter":1}],19:[function(require,module,exports){
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

		previousLink: new LinkPainterObserver( gallery, {
			className: 'disabled',
			linksToPaint: function () {
				return wrapper.querySelectorAll( '*[data-gallery-method="showPrevious"]' );
			},
			linksToUnPaint: function () {
				return wrapper.querySelectorAll( '*.disabled[data-gallery-method="showPrevious"]' );
			},
			shouldPaint: function() {
				return ( gallery.getPrevious() === false );
			}
		} ),

		nextLink: new LinkPainterObserver( gallery, {
			className: 'disabled',
			linksToPaint: function () {
				return wrapper.querySelectorAll( '*[data-gallery-method="showNext"]' );
			},
			linksToUnPaint: function () {
				return wrapper.querySelectorAll( '*.disabled[data-gallery-method="showNext"]' );
			},
			shouldPaint: function() {
				return ( gallery.getNext() === false );
			}
		} ),

		imageLink: new LinkPainterObserver( gallery, {
			className: 'current',
			linksToPaint: function () {
				return wrapper.querySelectorAll( 'a[data-gallery-method="show"][data-gallery-argument="' + gallery.getCurrentImageIndex() + '"]' );
			},
			linksToUnPaint: function () {
				return wrapper.querySelectorAll( 'a[data-gallery-method="show"][data-gallery-argument]' );
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

},{"./Gallery":18,"./controller/Keyboard":20,"./controller/Link":21,"./navigation/createArrowNav":22,"./navigation/createDotNav":23,"./observer/LinkPainter":24}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
'use strict';


var elementMatchesSelector = require( '../../helper/elementMatchesSelector' );


var LinkController = function LinkController( gallery, selector ) {

	// we can't do anything without a proper gallery
	if ( !gallery || typeof gallery.show !== 'function' || typeof gallery.showPrevious !== 'function' || typeof gallery.showPrevious !== 'function' ) {
		return false;
	}

	this.gallery = gallery;

	// we also can't do anything without how to look up the clicked link
	if ( !selector ) {
		return false;
	}

	this.selector = selector;

	// we want to be able to insert links to control the gallery
	// independent of the link being in the dom at this moment
	window.addEventListener( 'click', this.handleClick.bind( this ), false );

	return this;
};


var proto = LinkController.prototype;


proto.getTargetAncestorThatMatchesSelector = function getTargetAncestorThatMatchesSelector( target ) {
	if ( elementMatchesSelector( target, this.selector ) ) {
		return target;
	}

	var parentNode = target;
	while ( parentNode ) {
		if ( elementMatchesSelector( parentNode, this.selector ) ) {
			return parentNode;
		}
		parentNode = parentNode.parentNode;
	}

	return false;
};


proto.handleClick = function ( event ) {
	var target = this.getTargetAncestorThatMatchesSelector( event.target );

	if ( target ) {

		event.preventDefault();

		var method = target.getAttribute( 'data-gallery-method' );
		if ( method && typeof this.gallery[method] === 'function' ) {
			var argument = target.getAttribute( 'data-gallery-argument' );
			this.gallery[method]( argument );
		} else {
			this.gallery.showNext();
		}

	}

};


module.exports = LinkController;

},{"../../helper/elementMatchesSelector":25}],22:[function(require,module,exports){
'use strict';


var createNavItem = function createNavItem( innerText, method ) {
	var link = document.createElement( 'a' );
	link.className = 'arrow-nav-link';
	link.setAttribute( 'data-gallery-method', method );
	link.href = '#' + method;

	var span = document.createElement( 'span' );
	span.className = 'arrow-nav-link-text';
	span.innerText = innerText;
	link.appendChild( span );

	return link;
};


module.exports = function createArrowNav( wrapper ) {
	var frag = document.createDocumentFragment();

	var arrows = {
		'showPrevious': '‹',
		'showNext': '›'
	};

	for ( var arrow in arrows ) {
		var element = createNavItem( arrows[arrow], arrow );
		frag.appendChild( element );
	}

	var nav = document.createElement( 'nav' );
	nav.className = 'arrow-nav';
	nav.appendChild( frag );

	return wrapper.appendChild( nav );
};

},{}],23:[function(require,module,exports){
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
	link.appendChild( span );

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

},{}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
'use strict';


module.exports = function elementMatchesSelector( element, selector ) {

	if ( typeof element.matchesSelector === 'function' ) {
		return element.matchesSelector( selector );
	}

	var prefixes = [
		'moz',
		'ms',
		'o',
		'webkit'
	];

	for ( var i = 0; i < prefixes.length; i += 1 ) {
		var prefix = prefixes[i];

		if ( typeof element[prefix + 'MatchesSelector'] === 'function' ) {
			return element[prefix + 'MatchesSelector']( selector );
		}
	}

	// TODO: add parent.querySelectorAll polyfill
	return false;
};

},{}],26:[function(require,module,exports){
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

},{"./flickr/imagesDataToImgsFrag":16,"./flickr/requestPhotoset":17,"./gallery/builder":19}]},{},[26]);
