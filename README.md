jQuery Automatic Execution
--------------------------

What?
=====

This module is meant to allow you to bootstrap all your JS init code based upon
your body tag's id and class. This allows you to modularize some of that boilerplate
code, as well as concat it all into 1 cacheable script without causing interference
between all those pages.

The inspiration came from Paul Irish's concept and idea, [Markup-based unobtrusive comprehensive DOM-ready execution](paulirish.com/2009/markup-based-unobtrusive-comprehensive-dom-ready-execution/).


Usage
=====

**HTML**

    <body id="page-name" class="maps forms">

**JavaScript**

    // BEFORE the document.ready event...
    
    // register a single page's init code
    $.autoExec.registerPage("page-name", function () { ... });
    
    // register a behavior's init code
    $.autoExec.registerBehavior("maps", function () { ... init Google Maps API or something ... })
    $.autoExec.registerBehavior("forms", function () { ... form validation basics or something ... })
