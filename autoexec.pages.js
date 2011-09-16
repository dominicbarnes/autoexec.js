(function ($) {
	var AE = $.autoExec;

	AE.registerPage("page-1", $.noop);

	AE.registerPage("page-2", $.noop);

	AE.registerBehavior("common", $.noop);

	AE.registerBehavior("users", $.noop);

	AE.registerBehavior("dashboard", $.noop);

	AE.registerBehavior("init", function () {
		$.autoInit.debug = true;
		$.autoInit();
	});
})(jQuery);
