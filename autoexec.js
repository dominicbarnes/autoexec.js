/**
 * Boilerplate code to set up a "DOM-Based Execution Model" for JS code
 *
 * @inspiration http://paulirish.com/2009/markup-based-unobtrusive-comprehensive-dom-ready-execution/
 *
 * @author  Dominic Barnes
 * @version 0.2
 */
(function () {
	// wrapper for console.log that includes the plugin name
	var log = (function () {
		if (Function.prototype.bind && console) {
			if (typeof console.log === "object") {
				["log","info","warn","error","assert","dir","clear","profile","profileEnd"].forEach(function (method) {
					console[method] = this.bind(console[method], console);
				}, Function.prototype.call);
			}

			return function (level) {
				if (autoExec.debug) {
					console[level].apply(console, ["autoExec"].concat(Array.prototype.slice.call(arguments, 1)));
				}
			};
		} else {
			return function () {};
		}
	})();

	// we'll use the jQuery namespace, no need for operating on jQuery collections
	var autoExec = {
		// Determines whether or not to output anything when a log call is made
		debug: false,

		// Determines whether or not to automatically bind to document.ready (for jQuery)
		ready: true,

		// The element that used to execute the registry
		element: document.body,

		// holds the functions that have been registered
		registry: {
			// used for individual pages
			page: {},
			// used for "behaviors" that could apply to multiple pages
			behavior: {}
		},

		// Contains a list of ignore rules
		ignore: [ ],

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
			if (typeof fn === "function") {
				log("log", type, id, "(register)");
				this.registry[type][id] = fn;
			} else if (typeof id === "object") {
				var capType = type[0].toUpperCase() + type.slice(1);
				for (var key in id) {
					autoExec["register" + capType](key, id[key]);
				}
			} else {
				return this.registry[type][id];
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
		},

		/**
		 * Registers an ignore rule (only applies to behaviors)
		 *
		 * @param {string|Regexp} rule  If string, looks for exact match. If regex, runs regex.test
		 */
		registerIgnore: function (rule) {
			log("log", "ignore", rule, "(register)");
			this.ignore.push(rule);
		},

		/**
		 * Actually performs the execution based on the given element
		 */
		run: function () {
			var element = autoExec.element,                 // localize element
				registry = autoExec.registry,               // localize registry object
				page = element.id,                          // store as page id
				behaviors = element.className.split(/\s+/), // store as behavior list
				ignores = autoExec.ignore,                  // localize ignore list
				a, b, c, d, behavior, ignore;               // declare looping vars

			if (autoExec.debug && console && console.group) console.group("autoExec", "running");
			log("info", "registry", registry);

			behaviors.unshift("common");
			chkbehaviors: for (a = 0, b = behaviors.length; a < b; a++) {
				behavior = behaviors[a];
				if (!behavior) continue;

				if (ignores && ignores.length) {
					for (c = 0, d = ignores.length; c < d; c++) {
						ignore = ignores[c];
						if (ignore) {
							if ((typeof ignore === "string" && ignore === behavior) || (ignore.test && ignore.test(behavior))) {
								log("warn", "behavior", behavior, "(ignored)", ignore);
								continue chkbehaviors;
							}
						}
					}
				}

				if (behavior in registry.behavior) {
					log("log", "behavior", behavior, "(run)");
					registry.behavior[behavior]();
				} else {
					log("warn", "behavior", behavior, "(not registered)");
				}
			}

			// since there is only 1 id, no loop needed here
			if (page) {
				if (page in registry.page) {
					log("log", "page", page, "(run)");
					registry.page[page]();
				} else {
					log("warn", "page", page, "(not registered)");
				}
			}

			if (autoExec.debug && console && console.groupEnd) console.groupEnd();
		}
	};

	if (window) {
		window.AUTOEXEC = autoExec;

		if (jQuery) {
			jQuery.autoExec = autoExec;

			if (autoExec.ready) {
				jQuery(autoExec.run);
			}
		}
	}
})();
