# Miniature Octo Tribble

This is a little experiment fetching images from a [Flickr
photoset](https://www.flickr.com/photos/heatherpeaches/sets/72157639383517453/).
The images are then inserted on the page. Finally, a gallery is created for
all the images.

The gallery has dot indicators on the bottom to show where which image in the
photoset is in the view currently. The dots are clickable to jump to the
requested image. There are right and left arrows on the sides of the gallery.
There is keyboard navigation (right and left arrow keys). The arrows and
keyboard will change the current image to the next and previous images,
respectively.

There are no external JavaScript libraries, like JQuery or Angular. I did,
however, include the standard node
[event-emitter](http://nodejs.org/api/events.html) module, save time in this
exercise. Furthermore, there are no (S)CSS dependencies, like Compass or
Bootstrap. I am including the standard normalize.css to limit differences
between browser user-agent stylesheets.

This is intended for use in a modern browser with ECMAScript 5 compatibility. It was tested in Chrome and Safari on Mac OS X Yosemite, iOS 8 

---

I wanted to explore simple build system with this experiment.

Keeping the build process fast was one of the most important things. Since gulp uses streams and is concurrent by default it seemed like a good fit for fast build times. Sass is the natural choice for a CSS preprocessor since it’s popularity, feature set, and with libsass it’s speed. At this point, I don't want to write anything other than a CommonJS module, so browserify is my compiler of choice. I added in watchify for adding speed to subsequent builds while watching. Browsersync is in the mix to reload the browser whenever a watched build is complete.

This was my first time using [Travis](https://travis-ci.org/donotknow/miniature-octo-tribble) for continuous integration, and it was simple to setup and configure `npm test` and to create a small bash script to auto deploy the build to the [gh-pages](https://donotknow.github.io/miniature-octo-tribble/) branch.

Auto deployment to gh-pages status:

[![Build Status](https://travis-ci.org/donotknow/miniature-octo-tribble.svg?branch=master)](https://travis-ci.org/donotknow/miniature-octo-tribble)


---

#### Next steps:
* Add a unit testing  framework and unit tests for the Flickr and Gallery modules.
* Add swipe-ability and touch events for gallery interaction.
