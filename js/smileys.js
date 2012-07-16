(function(global, $) {
	"use strict";
	
	var AVAILABLE_MOODS = ["elated", "happy", "frowny"].join(" "),
		
		AVAILABLE_SPECIFICS = ["inquisitive", "lying", "honest", "angry", "constipated"].join(" "),
		
		ALL_SMILEYS = [AVAILABLE_MOODS, AVAILABLE_SPECIFICS].join(" "),
	
		DEFAULT_SIZE = "2",
		
		SIZE_UNITS = "px",
		
		MAX_SIZE = 40,
		MIN_SIZE = 1,
			
    	// keys i care about
		KEYUP = 38,
		KEYDOWN = 40,
		ENTER_KEY = 13,
		
		FIELDS = {
			SIZE: "size",
			MOOD: "mood",
			SPECIFIC: "specific"
		},
		
		TYPE = "{{type}}",
		SIZE = "{{size}}",
		
		smileyLink,
		
		HTML = ["<div class='" + TYPE + "'>",
					"\t<div class='left eye'></div>",
					"\t<div class='right eye'></div>",
					"\t<div class='mouth'></div>",
				"</div>"].join("\n"),
				
		CSS = ["<style type='text/css'>",
		       		"\t.smiley {",
		       		"\t\tfont-size: " + SIZE + "px;",
		       		"\t}",
		       "</style>"].join("\n");
	
	
	var $form, $smiley, $size, $cssCode, $htmlCode;
	
	String.prototype.escapeHTML = function () {                                                                                                        
		return this.replace(/>/g,'&gt;')
					.replace(/</g,'&lt;')
					.replace(/"/g,'&quot;');
	};

    function addCopyButton($code, text) {
        var $copyButton = $("<span class='copy'/>");
        
        $code.prepend($copyButton);
        
        $copyButton.zclip({
            path: "zclip/ZeroClipboard.swf",
            copy: text,
            afterCopy: function() {
                console.log("copied");
            }
        });
    }
	
	function updateCode() {
	    var css = CSS.replace(SIZE, $size.val()),
	        html = HTML.replace(TYPE, $smiley[0].className);
	    
		$cssCode.html(smileyLink.escapeHTML() + "\n" + css.escapeHTML());
		addCopyButton($cssCode, css);
		
		$htmlCode.html(html.escapeHTML());
		addCopyButton($htmlCode, html);
	}
	
	function pickSmiley() {
		var size = $size.val() || DEFAULT_SIZE;
		
		$smiley.css("fontSize", size + "px");

		$smiley.removeClass(ALL_SMILEYS);
		$smiley.addClass($form.find("select[name=" + FIELDS.MOOD + "]").val());
		$smiley.addClass($form.find("select[name=" + FIELDS.SPECIFIC + "]").val());
		
		updateCode();
	}
	
	function killSubmit(e) {
		e.preventDefault();
	}
	
	function capSize(size) { // not functioning pun
		if (isNaN(size)) { return MIN_SIZE; }
		return Math.max(Math.min(size, MAX_SIZE), MIN_SIZE);
	}
	
	function upAndDown(e) {
    	var size = parseInt($size.val() || 0, 10);
    	
        switch (e.keyCode) {
	        case KEYUP:
	        	$size.val(capSize(size + 1));
	        	pickSmiley();
	            break;
	            
	        case KEYDOWN:
	        	$size.val(capSize(size - 1));
	        	pickSmiley();
	            break;
	            
	        default:
	        	break;
        }
	}
	
	var getQueryStringParam = (function() {
		
			var query_string = (window.location.search.length > 1) ? window.location.search.substring(1) : null;
			var pairs = (query_string != null) ? query_string.split("&") : [];
			var params = {};
			
			for (var i=0; i < pairs.length; i++) {
				var pair = pairs[i].split("=");
				
				params[pair[0]] = pair[1] != null ? pair[1] : null;
			}
			
			return function(name) { return params[name] != null ? decodeURIComponent(params[name]) : null; }
	})();
	
	function inititializeSmiley() {
		var size = getQueryStringParam(FIELDS.SIZE),
			mood = getQueryStringParam(FIELDS.MOOD),
			specific = getQueryStringParam(FIELDS.SPECIFIC);
		
		if (size) {
			$size.val(capSize(parseInt(size || 0, 10)));
		}
		
		if (mood) {
			$form.find("input[name=" + FIELDS.MOOD + "][value=" + mood + "]").prop("checked", true);
		}
		
		if (specific) {
			$form.find("input[name=" + FIELDS.SPECIFIC + "][value=" + specific + "]").prop("checked", true);
		}
		
		pickSmiley();
	}
	
	$(function() {
		$form = $("form.pick-a-smiley");
		$size = $form.find("input[name=" + FIELDS.SIZE + "]");
		$smiley = $(".smiley");
		$cssCode = $("code.css");
		$htmlCode = $("code.html");
		
		var linkHref = $("link[href$='smileys.css']")[0].href;
		smileyLink = "<link href='" + linkHref + "' type='text/css' rel='stylesheet'>";
		
		$form.submit(killSubmit);
		$form.keydown(upAndDown);
		
		$form.find("select[name=" + FIELDS.MOOD + "], select[name=" + FIELDS.SPECIFIC + "]").change(pickSmiley);
		$size.change(pickSmiley)
		
		inititializeSmiley();
	});
	
})(this, jQuery);