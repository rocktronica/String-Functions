$(function(){

	var fn = {
		// WiP...
//		"CSS to JS Object": function(s) {
//			var lines = s.match(/(.*);/gm), o = [];
//			$.each(lines, function(i, line) {
//				var split = line.trim().split(":"),
//					sName = split[0].trim().replace(/["']/g, ""),
//					sValue = split[1].trim().replace(/^["']/g, "").replace(/["']\z/g, "g");
//					sValue = sValue.substr(0, sValue.length - 1);
//				console.log([sName, sValue]);
//				if (sName.indexOf("-") !== -1) { sName = "\"" + sName + "\""; }
//				if (!($.isNumeric(sValue) || sValue.toLowerCase() === "true" || sValue.toLowerCase() === "false")) {
//					sValue = "\"" + sValue + "\"";
//				}
//				o.push(sName + ": " + sValue + "\n");
//			});
//			return o.join("");
//		},
		"Select a function": function(s) {
			return s;
		},
		urlencode: function(s) {
			return encodeURIComponent(s);
		},
		urldecode: function(s) {
			return decodeURIComponent(s.replace(/\+/g,  " "));
		},
		lowercase: function(s) {
			return s.toLowerCase();
		},
		//http://dense13.com/blog/2009/05/03/converting-string-to-slug-javascript/
		deaccent: function(s) {
			s = s.toLowerCase().trim();
			var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
			var to   = "aaaaeeeeiiiioooouuuunc------";
			for (var i=0, l=from.length ; i<l ; i++) {
				s = s.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
			};
			return s;
		},
		slug: function(s) {
			s = fn.deaccent(s);
			return s.replace(/[^a-z0-9 -]/g, '')	// remove invalid chars
				.replace(/\s+/g, '-')				// whitespace to -
				.replace(/-+/g, '-');				// collapse dashes
		},
		devowel: function(s) {
			var o = [], l = s.length, v = { a: true, e: true, i: true, o: true, u: true };
			for (var i = 0; i < l; i++) {
				var c = s[i];
				if (!(c in v)) { o.push(c); }
			}
			return o.join("");
		},
		rot13: function(s){
			return s.replace(/[a-zA-Z]/g, function(c){
				return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
			});
		}
	};

	var bHasLocal = (function(){try{return"localStorage"in window&&window["localStorage"]!==null}catch(a){return false}})();
	var currentFunction;
	var	$selFunction = $("#selFunction")
		$input = $("#input"),
		$function = $("#function"),
		$output = $("#output");
	
	// fill select options
	(function(){
		var aOptions = [];
		$.each(fn, function(sF, f) {
			aOptions.push("<option value=\"" + sF + "\">" + sF + "</option>");
		});
		$selFunction.html(aOptions.join(""));
	}());

	// fill from localStorage before binding event handlers
	if (bHasLocal) {
		$input.text(localStorage.input);
		$selFunction.find("option[value='" + localStorage.function + "']").attr("selected","selected");
	}
	
	// selection change event
	$selFunction.on("change", function(){
		var sVal = $(this).val();
		currentFunction = fn[sVal];
		$function.text(functionString(currentFunction));
		if (bHasLocal) { localStorage.function = sVal; }
		updateOutput();
	}).change();
	
	function functionString(funct) {
		var s = funct.toString()
			.replace(/^\t{3}/mg, "\t")		// detab above
			.replace(/^\s{2}}/mg, "}")		// remove tabs on last line
			.replace(/\t/mg, "    ");		// tabs to spaces
		return s;
	}
	
	function updateOutput() {
		var sInput = $input.html().replace(/<br[^>]*>/gm,"\n"), sOutput;
		if (typeof currentFunction === "function") {
			sOutput = currentFunction(sInput);
		} else { sOutput = "ERROR"; }
		$output.html(sOutput);
		if (bHasLocal) { localStorage.input = sInput; }
	}
	
	// input change event
	$input.on("keyup change", updateOutput).focus();

	// deal w/ buggy contenteditables
	$(".contenteditable").live("change", function(){
	    var $obj = $(this);
	    if ($obj.text() === "") { $obj.html("&nbsp;"); }
	}).trigger("change");
	
	// function preview toggler
	var $aShowFunction = $("#aShowFunction").click(function(){
		$function.toggle();
		return false;
	});

});