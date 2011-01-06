JQuery Blank
============

Credits
--------

 * Jeff Hui - jeffhui.net
 * Ashish - ashish@setfive.com
 * Sherri Alexander - sherri-alexander.com

About
--------

JQuery Blank is a simple way to create default values for text fields and textareas
which hints to the user what should be filled into the field.
 
A good example is [mobile me's][1] login text input fields. You can also see a [demo here][2].

When the user focuses on the textbox, the search text is instantly removed and the
user can then type something. If the user leaves the textbox and if the textbox is
 still empty, the default text is restored.

Simplest usage:

`$(myelement).blank('Search');`

Documentation
=============

Only one function is added.

`jQuery.fn.blank([default_text[, options]]);`

* `default_text`: The default text to display for the given element.
* `options`: Additional parameters to pass: (object)
    * `defaultCSS`: The css style when the text input field is empty. This can be either a object (hash) or a function call that returns an object. The function contains the element as this and as the first parameter. The default value is {color: '#999'}.
    * `normalCSS`: The css style when the text has entered user input. This can also be either an object or a function that returns one. The parameters passed to the function are the element, the object of defaultCSS, and the object of d. The element is also passed as this. The default is a function that merges both defaultCSS and defaultFocusCSS for style attributes and computates the style values for the element when it is called.
    * `defaultFocusCSS`: The css style when the text input field has user focus, but is still blank (user didn't type anything yet). This is used to for a similar effect like Apple's me.com login box. This style only applies when defaultUntilType is set to true. Defaults to {color: '#bbb'}.
    * `defaultUntilType`: If enabled, when the user focuses on the text input, the defaultFocusCSS style is applied and the default text is display until the user types something. Once the user types something, the default text is removed and the user can type input.

If no parameters are specified, then the function returns whether or not the text 
field is blank. True if the input text is blank, false if not.

Example usage:

    $(function(){ $('#myform').blank('Required'); });
	$('#myform').submit(function(){
	  if($('#myinput').blank()){
		alert('Please fill out the input box!');
		return false;
	  }
	  return true;
	});

Events
==========

Since version 1.4, two events exist for jquery.blank elements. They can be hooked using `$.bind('<trigger-name>', function(){});`

* `blank`: This is called when the text field is set to blank. For *defaultUntilType* enabled fields, this is on keyup, and onblur for other text fields.
* `fill`: This is called when the text field is filled by user input. For *defaultUntilType* enabled fields, this is on keydown, and onblur for other text fields.


License
=========

[MIT License][3]

 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:
 
 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.


[1]: http://me.com/ "Apple's Mobile Me"
[2]: http://demo.jeffhui.net/jquery-blank/ "Example of JQuery.Blank"
[3]: http://creativecommons.org/licenses/MIT/

