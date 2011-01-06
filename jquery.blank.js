/** jquery.blank ver. 1.4 - JQuery Plugin
 * =============
 * Credits:
 *  o Jeff Hui - jeffhui.net
 *  o Ashish - ashish@setfive.com
 *  o Sherri Alexander - sherri-alexander.com
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
 * =============
 * vim: tabstop=4;shiftwidth=4;noexpandtab
 */
(function($){

// keys that we ignore for keypress (for defaultUntilType)
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
];
// keys that do a movement in the textbox that we should suppress
// we can assume we're at the left-most side
var moveList = [
	34, 35 // pgdown, end
];

var fill_triggername = 'fill',
	blank_triggername = 'blank';

// Gets the value of func, calling it if its a function. el nas param
// are values passed into it.
function call(func, el, param){
	if($.isFunction(func))
		return (param != undefined) ? func.call(el, el, param) : func.call(el, el);
	else
		return func;
}

// moves the text caret for the element to beginning of the textfield.
// accepts the raw element (not the jQuery object).
// Optionally accepts an optional position to set the caret to.
function reset_caret(e, pos){
	if(pos === undefined)
		pos = 0;
	if(e.selectionStart !== undefined){ // W3C compliant browsers
		e.selectionStart = pos;
		e.selectionEnd = pos;
	} else if(e.createTextRange){ // IE-browsers
		var tr = e.createTextRange();
		tr.collapse(true);
		tr.moveStart('character', pos);
		tr.moveEnd('character', pos);
		tr.select();
	}
}


////// main function //////
// assume: the user knows this only should be used only with text-typing elements
$.fn.blank = function(text, options){

	// when we use $(el).blank() # returns a true/false if the input is actually blank
	if(text === undefined){
		var d = this.data('blank');
		return (d !== undefined);
	}

	// gather options
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

	// function to work on each element we got
	return this.each(function(){
		if(!$(this).is('input[type=text], input[type=password], textarea'))
		  return true; // continue

		// css calls are in here, instead of out this call because
		// option could be a function; which requires the element parameter
		var defCSS = call(opt.defaultCSS, this),
			defFocusCSS = call(opt.defaultFocusCSS, this, defCSS),
			normCSS = call(opt.normalCSS, this, defCSS, defFocusCSS),
			el = $(this),
			elBlankForm; // used by password fields only

		// Ashish Datta ashish@setfive.com
		// If the current text is blank text, wipe it since it might be a CTRL+R refresh
		if(el.val() === text)
			el.val('');

		// request from: Ashish Datta ashish@setfive.com
		// Password field support:
		// We can't change the type=password attribute, so we have to use a new textfield
		// that is swapped when we need to show default text.
		if(el.is(':password')){
			elBlankForm = el.after('<input type="text" class="jqblank_field" />').next();
			elBlankForm.blank(text, options);
			el.hide();

			if(opt.defaultUntilType){
				elBlankForm.bind('fill', function(){
					elBlankForm.hide();
					el.val(elBlankForm.val()).show().focus();
					reset_caret(el, 1);
				});
				el.keyup(function(evt){
					if(el.val() === ''){
						el.hide();
						elBlankForm.val('').show().focus().trigger('keyup', [evt]);
						reset_caret(elBlankForm, 1);
					}
				});
			} else {
				elBlankForm.focus(function(){
					elBlankForm.hide();
					el.show().focus();
				});
				el.blur(function(){
					if($.trim(el.val()) === ''){
						el.hide();
						elBlankForm.show().blur();
					}
				});
			}
		}

		// ashish@setfive.com
		// if the elements are inside a form, revert to blank text
		el.closest('form').submit(function(){
			if(el.blank())
				el.val('');
			return true;
		}).bind('reset', function(){
			setTimeout(function(){
				if(el.is(':password')){
					if(opt.defaultUntilType)
						el.hide().next().show().blur().keyup();
					else
						el.focus().val('').keyup().blur();
				} else
					el.keyup().blur();
			}, 1);
		});

		// don't continue if we're a password field
		if(elBlankForm)
			return true; // continue
		
		if(!opt.defaultUntilType){

			el.blur(function(){
				var isBlank = el.blank();
				if($.trim(el.val()) === ''){
					el.val(text).css(defCSS).data('blank', 1);
					if(!isBlank)
						el.trigger(blank_triggername);
				} else {
					el.removeData('blank');
					if(isBlank)
						el.trigger(fill_triggername);
				}
			}).focus(function(){
				if(el.blank())
					el.val('').css(normCSS);
			}).blur();

		} else { // opt.defaultUntilType

			el.data('blank', 1);
			el.blur(function(){
				if(el.blank()){
					el.css(defCSS).val(text);
				}
			}).mouseup(function(){

				if(!el.blank()) return true;
				reset_caret(el.get(0));

			}).focus(function(){

				if(el.blank()){
					el.css(defFocusCSS);
					// disable text selection on tab-focus
					setTimeout(function(){reset_caret(el.get(0));}, 1);
				}

			}).keydown(function(evt){

				if($.inArray(evt.keyCode, ignoreList) !== -1){
					if(el.blank() && $.inArray(evt.keyCode, moveList) !== -1)
						setTimeout(function(){reset_caret(el.get(0))}, 1);
					return true;
				}
				var v = el.val();
				if(el.blank()){
					el.val(v.substring(0, v.length-text.length))
					.removeData('blank')
					.css(normCSS)
					.trigger(fill_triggername);
				}

			}).keyup(function(){

				if(!el.blank() && el.val() === '')
					el.data('blank', 1).css(defFocusCSS).trigger(blank_triggername);

			}).blur();
		} // if-else
	}); // return this.each(function(){})

}; // $.fn.blank = function(){}

})(jQuery);
