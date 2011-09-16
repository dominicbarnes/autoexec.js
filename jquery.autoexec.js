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
	function log() {
		if ($.autoExec.debug && window.console) {
			console.log(["autoExec"].concat(Array.prototype.slice.call(arguments)));
		}
	}

	// we'll use the jQuery namespace, no need for operating on jQuery collections
	$.autoExec = {
		// the only real config option at this point
		debug: true,

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
				log(type, "register", id);
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
			behaviors = body.className.split(/\s+/); // store as behavior list

		// prepend "common" before looping each of the configured behaviors
		$.each(["common"].concat(behaviors), function (x, behavior) {
			// we only try and execute if we have a registered handler
			if (behavior in funcs.behavior) {
				log("behavior", "run", behavior);
				funcs.behavior[behavior]();
			} else {
				log("This behavior has not been registered", behavior);
			}
		});

		// since there is only 1 id, no loop needed here
		if (page && page in funcs.page) {
			log("page", "run", page);
			funcs.page[page]();
		} else {
			log("This page has not been registered", page);
		}
	});
})(jQuery);
