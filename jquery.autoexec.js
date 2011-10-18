/**
 * Boilerplate code to set up a "DOM-Based Execution Model" for JS code
 * This code won't remain jQuery-specific forever, I promise :)
 *
 * @inspiration http://paulirish.com/2009/markup-based-unobtrusive-comprehensive-dom-ready-execution/
 *
 * @author Dominic Barnes
 */
(function ($) {
	// wrapper for console.log that includes the plugin name
	var log = (function () {
		if (Function.prototype.bind && console) {
			if (typeof console.log === "object") {
				["log","info","warn","error","assert","dir","clear","profile","profileEnd"].forEach(function (method) {
					console[method] = this.bind(console[method], console);
				}, Function.prototype.call);
			}

			return function (level) {
				if ($.autoExec.debug) {
					console[level].apply(console, ["autoExec"].concat(Array.prototype.slice.call(arguments, 1)));
				}
			};
		} else {
			return $.noop;
		}
	})();

	// we'll use the jQuery namespace, no need for operating on jQuery collections
	$.autoExec = {
		// the only real config option at this point
		debug: false,

		// holds the functions that have been registered
		funcs: {
			// used for individual pages
			page: {},
			// used for "behaviors" that could apply to multiple pages
			behavior: {}
		},

		/**
		 * Low-level registration method
		 * Will return the currently registered function if `fn` is left out
		 *
		 * @param {string}   type  Only "page" and "behavior" are valid
		 * @param {string}   id
		 * @param {function} [fn]
		 *
		 * @return {undefined|function}
		 */
		register: function (type, id, fn) {
			if ($.isFunction(fn)) {
				log("log", type, id, "(register)");
				this.funcs[type][id] = fn;
			} else if ($.isPlainObject(id)) {
				$.each(id, function (id, fn) {
					var capTitle = type[0].toUpperCase() + type.slice(1);
					$.autoExec["register" + capTitle](id, fn);
				});
			} else {
				return this.funcs[type][id];
			}
		},

		/**
		 * Wrapper for registering an individual pages function
		 *
		 * @param {string}   id
		 * @param {function} [fn]
		 *
		 * @return {undefined|function}
		 */
		registerPage: function (id, fn) {
			return this.register("page", id, fn);
		},

		/**
		 * Wrapper for registering a common behavior function
		 *
		 * @param {string}   id
		 * @param {function} [fn]
		 *
		 * @return {undefined|function}
		 */
		registerBehavior: function (id, fn) {
			return this.register("behavior", id, fn);
		}
	};

	$(function ($) {
		var body = document.body,                    // cache body element
			funcs = $.autoExec.funcs,                // cache funcs object
			page = body.id,                          // store as page id
			behaviors = body.className.split(/\s+/), // store as behavior list
			ignore = /outer/;

		// prepend "common" before looping each of the configured behaviors
		$.each(["common"].concat(behaviors), function (x, behavior) {
			if (!behavior) return;
			if (ignore && ignore.test(behavior)) {
				log("warn", "behavior", behavior, "(ignored)");
				return;
			}

			// we only try and execute if we have a registered handler
			if (behavior in funcs.behavior) {
				log("log", "behavior", behavior, "(run)");
				funcs.behavior[behavior]();
			} else {
				log("warn", "behavior", behavior, "(not registered)");
			}
		});

		// since there is only 1 id, no loop needed here
		if (page) {
			if (page in funcs.page) {
				log("log", "page", page, "(run)");
				funcs.page[page]();
			} else {
				log("warn", "page", page, "(not registered)");
			}
		}
	});
})(jQuery);
