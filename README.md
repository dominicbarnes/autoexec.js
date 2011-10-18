JavaScript Automatic Execution
==============================

Inspiration from Paul Irish's concept and idea,
[Markup-based unobtrusive comprehensive DOM-ready execution](paulirish.com/2009/markup-based-unobtrusive-comprehensive-dom-ready-execution/).

What?
-----

Dynamically execute JS code based on your body tag's id and class. All your
page code can be included as one or many files. All you do is **register**
each snippet with autoExec, and it handles the rest for you!

This project used to require jQuery, now it is library agnostic! If you
are using jQuery, it will automatically bind to the `document.ready` event
for you. (unless you set `AUTOEXEC.ready` to `false`) Otherwise, just
use the `AUTOEXEC.run()` method inside your own code.


Configuration
-------------

<table>
	<thead>
		<tr>
			<th>Property</th>
			<th>Type</th>
			<th>Default</th>
			<th>Comments</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>debug</td>
			<td>boolean</td>
			<td>false</td>
			<td>Determines whether or not to output to the console. (there is already a wrapper to make sure this doesn't break IE)</td>
		</tr>
        <tr>
            <td>ready</td>
            <td>boolean</td>
            <td>true</td>
            <td>If true, automatically binds to the jQuery ready event. (if jQuery is found)</td>
        </tr>
        <tr>
            <td>element</td>
            <td>HTMLElement</td>
            <td>document.body</td>
            <td>The element to use when determining what to execute from the registry. (still uses id and class attributes)</td>
        </tr>
	</tbody>
</table>

API Documentation
-----------------

### registerPage (id, fn)

Registers a page-specific handler

<table>
	<thead>
		<tr>
			<th>Name</th>
			<th>Type</th>
			<th>Comments</th>
		</tr>
	</thead>
	<tbody>
        <tr>
            <td>id</td>
            <td>string</td>
            <td>The string id used to match the page to a #id</td>
        </tr>
        <tr>
            <td>fn</td>
            <td>function</td>
            <td>Code snippet to be executed. There are no arguments, and no context. (except window of course)</td>
        </tr>
	</tbody>
</table>

### registerBehavior (id, fn)

Registers a handler for a page behavior

<table>
	<thead>
		<tr>
			<th>Name</th>
			<th>Type</th>
			<th>Comments</th>
		</tr>
	</thead>
	<tbody>
        <tr>
            <td>id</td>
            <td>string</td>
            <td>The string id used to match the page to a #id</td>
        </tr>
        <tr>
            <td>fn</td>
            <td>function</td>
            <td>Code snippet to be executed. There are no arguments, and no context. (except window of course)</td>
        </tr>
	</tbody>
</table>

### register (type, id, fn)

Low-level registration method (registerPage and registerBehavior are preferred)

<table>
	<thead>
		<tr>
			<th>Name</th>
			<th>Type</th>
			<th>Comments</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>type</td>
			<td>string</td>
			<td>"page" or "behavior" accepted</td>
		</tr>
        <tr>
            <td>id</td>
            <td>string</td>
            <td>The string id used to match the page/behavior to a #id or .class</td>
        </tr>
        <tr>
            <td>fn</td>
            <td>function</td>
            <td>Code snippet to be executed. There are no arguments, and no context. (except window of course)</td>
        </tr>
	</tbody>
</table>

### registerIgnore (rule)

Registers an ignore rule. (only applies to behaviors) All ignore rules are
built into an array, and all rules are tested against every behavior before
they are executed.

If you choose to use a regular expression, please note that you'll need to
use `^` and `$` in order to match the entire string. Otherwise, you could be
matching against substrings instead, producing undesired results.

<table>
	<thead>
		<tr>
			<th>Name</th>
			<th>Type</th>
			<th>Comments</th>
		</tr>
	</thead>
	<tbody>
        <tr>
            <td>rule</td>
            <td>string|regexp</td>
            <td>If a string, looks for an exact match. If a regexp, runs regexp.test.</td>
        </tr>
	</tbody>
</table>

### run ()

Runs through the element #id and .class, executing items from the registry as needed.

If you are using no library, or a library other than jQuery, use this method within
your window.load, domready, etc. event.
