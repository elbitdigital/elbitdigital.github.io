
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
