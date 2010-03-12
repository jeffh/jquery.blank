/** jquery.blank ver. 1.3 - JQuery Plugin
 * =============
 * Credits:
 *  o Ashish - ashish@setfive.com
 *  o Sherri Alexander - sherri-alexander.com
 * =============
 * vim: tabstop=4;shiftwidth=4;noexpandtab
 * =============
 * Changelog:
 *
 * --- Version 1.3
 *  o Refactored code
 *  o Changed onsubmit behavior for blank text to be empty string
 *	  (credits: Ashish - ashish@setfive.com)
 *
 * --- Version 1.2
 *  o Created changelog
 *  o Fixed indexof bug for IE (reported by Sherri Alexander)
 * =============
 * Examples:
 *    $('#id').blank('default text');
 *    $('#id').blank('default text', {defaultCSS: '#eee'});
 *    $('#id').blank(); // returns true if default blank text is being displayed
 * =============
 * Implements default text for text fields when disappear when the user focuses the element.
 *
 * Options:
 *	defaultCSS:       CSS styling when the textbox is displaying its default text. This can
 *	                  be either an object hash or a function that returns a object hash. This
 *	                  value is directly passed to jquery's css method.
 *	                  Defaults to {color: '#999'}.
 *	defaultFocusCSS:  Identical to defaultCSS, but this is used when the user focuses the
 *	                  text input but has not typed anything yet. This is only used when
 *	                  defaultUntilType is set to true.
 *	                  Defaults to {color: '#bbb'}.
 *	normalCSS:        Identical for defaultCSS except it applies to the CSS styling for when
 *	                  the user enters text into the input box.
 *	                  Defaults to a function which looks into a merged hash of both
 *	                  defaultCSS and defaultFocusCSS for css properties that were set and
 *	                  gets the computated style when this jquery.blank is called.
 *	defaultUntilType: Sets the default text to display when the user focuses on the text
 *	                  input but does not highlight anything. Refer to Apple's me.com for a
 *	                  similar kind of effect with the login textboxes.
 *	                  Defaults to false.
 * =============
 * Copyright (c) 2009 Jeff Hui <contrib@jeffhui.net>
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 */
(function($){

// assume: the user knows this only should be used only with text-typing elements
$.fn.blank = function(text, options){

// when we use $(el).blank() # returns a true/false if the input is actually blank
if(text === undefined){
	var d = this.data('blank');
	return (d !== undefined);
}

var opt = {
	defaultCSS: {color: '#999'},
	normalCSS: function(el, defCSS, defFocusCSS){
		// here we just try to get default css styles from the element
		// for all key values of defCSS
		var css = $.extend({}, defCSS, defFocusCSS);
		var e = $(this);
		$.each(defCSS, function(i, v){
			css[i] = $.curCSS(e.get(0), i);
		});
		return css;
	},
	defaultFocusCSS: {color: '#bbb'},
	defaultUntilType: false
};
$.extend(opt, options);

// it's outside the each call since less function defs inside the each call
// makes things faster. It's minor, but I like var defs at the start of bodies.
function call(func, el, param){
	if($.isFunction(func))
		return (param != undefined) ? func.call(el, el, param) : func.call(el, el);
	else
		return func;
}

return this.each(function(){
	// css calls are in here, instead of out this call because
	// option could be a function; which requires the element parameter
	var defCSS = call(opt.defaultCSS, this),
		defFocusCSS = call(opt.defaultFocusCSS, this, defCSS),
		normCSS = call(opt.normalCSS, this, defCSS, defFocusCSS),
		el = $(this);
	if(!el.is('input[type=text], textarea'))
	  return true; // continue

	// contrib: ashish@setfive.com
	// if the elements are inside a form, revert to blank text
	var form = $(this).closest('form');
	if(form){
		form.submit(function(){
			if(el.blank())
				el.val('');
			return true;
		});
	}
	// end contrib

	if(!opt.defaultUntilType){

		el.blur(function(){
			if($.trim(el.val()) === ''){
				el.val(text).css(defCSS).data('blank', 1);
			} else {
				el.removeData('blank');
			}
		}).focus(function(){
			if(el.blank()){
				el.val('').css(normCSS);
			}
		}).blur();

	} else { // if !opt.defaultUntilType

		el.data('blank', 1);
		el.blur(function(){
			if(el.data('blank')){
				el.css(defCSS).val(text);
			}
		}).mouseup(function(){

			if(!el.blank()) return true;
			var e = el.get(0);
			if(e.selectionStart !== undefined){ // W3C compliant browsers
				e.selectionStart = 0;
				e.selectionEnd = 0;
			} else if(e.createTextRange){ // IE-browsers
				var tr = e.createTextRange();
				tr.collapse(true);
				tr.moveStart('character', 0);
				tr.moveEnd('character', 0);
				tr.select();
			}

		}).focus(function(){

			if(el.blank()){
				el.css(defFocusCSS);
			}

		}).keydown(function(evt){

			var ignoreList = [
			8,  // backspace
			9,  // tab
			16, // shift
			17, // alt
			18, // pause/break
			20, // capslock
			27, // esc
			33, // pgup
			34, // pgdown
			35, // end
			36, // home
			91, // left winkey
			92, // right winkey
			144,// numlock
			145 // scroll lock
			]
			if($.inArray(evt.keyCode, ignoreList) !== -1) return true;
			var v = el.val();
			if(el.blank()){
				el.removeData('blank').css(normCSS).val(v.substring(0, v.length-text.length));
			}

		}).keyup(function(){

			var v = el.val();
			if(!el.blank() && v === ''){
				el.data('blank', 1).css(defFocusCSS);
			}

		}).blur();
	} // if-else
}); // return this.each(function(){})

}; // $.fn.blank = function(){}
})(jQuery);
