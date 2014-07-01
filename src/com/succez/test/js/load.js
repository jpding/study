$.extend({
	loadJsCss : function(file) {
		var files = typeof file == "string" ? [file] : file;
		var ctx = sz.sys.ctx();
		for (var i = 0; i < files.length; i++) {
			var name = files[i];
			var att = name.split('.');
			var ext = att[att.length - 1].toLowerCase();
			var isCSS = ext == "css";
			var tag = isCSS ? "link" : "script";
			var attr = isCSS
					? " type='text/css' rel='stylesheet' "
					: " language='javascript' type='text/javascript' ";
			var link = (isCSS ? "href" : "src") + "='" + ctx + name + "'";
			if ($(tag + "[" + link + "]").length == 0){
				$("<" + tag + attr + link + "></" + tag + ">").appendTo("head");
			}
		}
	}
});