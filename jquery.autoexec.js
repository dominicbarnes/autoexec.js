/**
 * Boilerplate code to set up a "DOM-Based Execution Model" for JS code
 *
 * @inspiration http://paulirish.com/2009/markup-based-unobtrusive-comprehensive-dom-ready-execution/
 *
 * @author Dominic Barnes
 *
 * --------------------------------------------------------------------
 *
 * A lot of front-end code (not libs) that initializes plugins on the page is either
 * used only 1 time for a very specific #id, or they are called many times on different
 * pages, using a common .class to tie them together.
 *
 * For scripts only used "one time", (ie. on 1 specific page) you either create an
 * entire script that only gets <script> included on that one page. Or, you could
 * create some global var to keep track of the current page id that you check before running.
 *
 * Also, consider certain plugins that appear frequently on your site, but not everywhere
 * and all the time. Usually, using a common class name and applying to those classes
 * on each page load will work, but that DOM query has to be run each and every page.
 *
 * This model can also be applied for CSS, it's not only for JS.
 * Assign each page a unique #id, that gets applied to the body tag.
 *
 * Also, break up your "boilerplate code" into small, reusable modules.
 * For each page, add a .class to the body for each of those modules you'll need
 *
 * Before your document.ready fires, make sure to register all your "pages" and "behaviors"
 * via $.autoExec.registerPage("page-id", fn) and $.autoExec.registerBehavior("module-id", fn)
 *
 * $.autoExec will handle the rest :)
 * Use `$.autoExec.debug = true;` to see what's going on behind the scenes
 *
 * Creating and registering a "common" behavior in your init code will cause
 * it to run for all pages as well, just for your convenience.
 */
(function ($) {
	// wrapper for console.log that includes the plugin name
	function log() {
		if ($.autoInit.debug && window.console) {
			console.log(["autoExec"].concat(Array.prototype.slice.call(arguments)));
		}
	}

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
			if (typeof fn === "function") {
				this.funcs[type][id] = fn;
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
				log("Setting up behavior", behavior);
				funcs.behavior[behavior]();
			} else {
				log("This behavior has not been registered", behavior);
			}
		});

		// since there is only 1 id, no loop needed here
		if (page && page in funcs.page) {
			log("Setting up page", page);
			funcs.page[page]();
		} else {
			log("This page has not been registered", page);
		}
	});
})(jQuery);
