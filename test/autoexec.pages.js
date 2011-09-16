(function ($) {
	var AE = $.autoExec;

	AE.registerPage("user-dashboard", $.noop);
	AE.registerPage("page-1", $.noop);
	AE.registerPage("page-2", $.noop);

	AE.registerBehavior("common", $.noop);
	AE.registerBehavior("users", $.noop);
	AE.registerBehavior("dashboard", $.noop);
})(jQuery);
