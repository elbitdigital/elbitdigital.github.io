/*!
 * Elbit Website Project v0.0.0 (http://letsmowe.org/)
 * Copyright 2013-2016 Elbit Developers
 * Licensed under MIT (https://github.com/elbitdigital/elbitdigital.github.io/blob/master/LICENSE)
*/

/* Scroll */

var Anchor = (function () {

	/**
	 * Anchor class constructor
	 * @constructor
	 */
	function Anchor(element, options) {

		var self = this;

		this.element = element;

		_.defaults(options, {
			duration:  200,
			easing: 'linear',
			callback: false,
			scrollOffset: 0
		});

		this.duration = options.duration;
		this.easing = options.easing;
		this.callback = options.callback;
		this.scrollOffset = options.scrollOffset;

		this.push = function() {

			self.start = this.bodyElement.scrollTop;
			self.startTime = Date.now();

			// Height checks to prevent requestAnimationFrame from infinitely looping
			// If the function tries to scroll below the visible document area
			// it should only scroll to the bottom of the document
			self.documentHeight = self.getDocumentHeight();
			self.windowHeight = self.getWindowHeight();
			self.destinationPosition = self.getDestinationPosition();

			self.animate();

		};

		if (this.element)
			this.init();

	}

	/**
	 * Returns document.documentElement for Chrome and Safari
	 * document.body for rest of the world
	 *
	 * @return body DOM element
	 */
	Anchor.prototype.checkBody = function () {

		document.documentElement.scrollTop += 1;
		var body = (document.documentElement.scrollTop !== 0) ? document.documentElement : document.body;
		document.documentElement.scrollTop -= 1;

		return body;

	};

	/**
	 * Choose what easing function to use
	 * @param easing String
	 * @param t Integer
	 */
	Anchor.prototype.easingOption = function (easing , t) {

		switch (easing) {

			case 'linear':
				return t;
				break;

			case 'easeInQuad':
				return t * t;
				break;

			case 'easeOutQuad':
				return t * (2 - t);
				break;

			case 'easeInOutQuad':
				return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
				break;

			case 'easeInCubic':
				return t * t * t;
				break;

			case 'easeOutCubic':
				return (--t) * t * t + 1;
				break;

			case 'easeInOutCubic':
				return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
				break;

			case 'easeInQuart':
				return t * t * t * t;
				break;

			case 'easeOutQuart':
				return 1 - (--t) * t * t * t;
				break;

			case 'easeInOutQuart':
				return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
				break;

			case 'easeInQuint':
				return t * t * t * t * t;
				break;

			case 'easeOutQuint':
				return 1 + (--t) * t * t * t * t;
				break;

			case 'easeInOutQuint':
				return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
				break;

			default:
				return t * t;
				break;

		}

	};


	/**
	 * Animate the body element until destination
	 */
	Anchor.prototype.animate = function () {

		var self = this;

		var now = Date.now();
		var time = Math.min(1, ((now - this.startTime) / this.duration));
		var timeFunction = this.easingOption(this.easing, time);
		this.bodyElement.scrollTop = (timeFunction * (this.destinationPosition - this.start)) + this.start;

		if (this.bodyElement.scrollTop === this.destinationPosition) {
			return;
		}

		requestAnimationFrame(function () {

			self.animate();

		});

	};

	Anchor.prototype.getDestinationPosition = function () {

		return ( this.documentHeight - this.element.offsetTop < this.windowHeight ? this.documentHeight - this.windowHeight : this.element.offsetTop ) + this.scrollOffset;

	};

	Anchor.prototype.getWindowHeight = function () {

		return window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;

	};

	Anchor.prototype.getDocumentHeight = function () {

		return Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);

	};

	Anchor.prototype.init = function () {

		this.bodyElement = this.checkBody();

	};

	return Anchor;

})();


/* Mowe Logo 1.0 */

var Logo = (function () {

	/**
	 * SVG Logo request
	 * @param viewport {Element}
	 * @param url {string}
	 * @param fallback {object}
	 * @constructor
	 */
	function Logo(viewport, url, fallback) {

		var self = this;

		this.viewport = viewport;
		this.url = url;
		this.fallback = fallback;

		this.get();

	}

	/**
	 * Append to element
	 * @param toElement {Element}
	 * @param before {Element}
	 */
	Logo.prototype.appendTo = function (toElement, before) {

		if (!before)
			toElement.appendChild(this.viewport);
		else
			toElement.insertBefore(this.viewport, before);

	};

	/**
	 * Clone the logo and append to element
	 * @param toElement {Element}
	 */
	Logo.prototype.cloneTo = function (toElement) {

		toElement.appendChild(this.viewport.cloneNode(this.viewport));

	};

	Logo.prototype.get = function () {

		var self = this;

		if (this.viewport && this.url) {

			var request = new XMLHttpRequest();
			request.open('GET', this.url, true);

			request.onreadystatechange = function() {

				if (this.readyState === 4)
					if (this.status == 200)
						if (this.responseText) {

							try {

								self.viewport.innerHTML = this.responseText;
								if (self.fallback)
									self.fallback();

							} catch (e) { }

						}

			};

			request.send();
			request = null;

		}

	};

	return Logo;

})();