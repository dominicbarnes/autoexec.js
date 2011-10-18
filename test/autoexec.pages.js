(function ($) {
	var AE = AUTOEXEC;
	AE.registerIgnore("users");
	AE.registerIgnore(/^widget\-[0-9]+$/);

	AE.registerPage("user-dashboard", $.noop);
	AE.registerPage({
		"page-1": $.noop,
		"page-2": $.noop
	});

	AE.registerBehavior("common", $.noop);
	AE.registerBehavior("users", $.noop);
	AE.registerBehavior("dashboard", $.noop);
	AE.registerBehavior({
		"widget-1": $.noop,
		"widget-2": $.noop,
		"widget-a": $.noop,
		"widget-b": $.noop
	});
})(jQuery);
