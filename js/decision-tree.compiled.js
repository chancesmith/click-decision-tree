"use strict";

var decisions = [];
var count = 0;

// get data
$.getJSON("./decisions.json").done(function (data) {
	var items = [];
	decisions = data;
	optionBuild();
}).fail(function (jqxhr, textStatus, error) {
	var err = textStatus + ", " + error;
	console.log("Request Failed: " + err);
});

// sentence parts data
var sentenceParts = ["I&#39;m interested in", "and want to know more about", "especially"];

// function used onClick of options in the decision tree
function optionBuild() {
	var id = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
	var btnText = arguments.length <= 1 || arguments[1] === undefined ? "pick one" : arguments[1];

	checkLevels();

	// grab last count for #id's to show last option choosen in button
	var lastCount = count - 1;
	var lastButton = "#button-text-" + lastCount;
	$(lastButton).empty();
	$(lastButton).text(btnText); // insert text into button

	// pull options data
	var options = $.grep(decisions, function (v) {
		return v.parent == id;
	});

	// push into items the options under parent
	var items = [];
	$.each(options, function (idx, obj) {
		if (obj.url === null) {
			items.push("<li onClick='optionBuild(" + obj.id + ", \"" + obj.text + "\" );'><a>" + obj.text + "</a></li>");
		} else {
			items.push("<li><a href='" + obj.url + "'>" + obj.text + "</a></li>");
		}
	});

	// force only showing 3 levels deep
	if (count < 3) {

		// grab count for #id's
		var dataCount = "#data-" + count;
		var optionsCount = '#options-' + count;

		// display options box
		$('<div id="options-' + count + '"></div>')
		.appendTo('#decision-tree');

		// display sentence part
		$('<p>' + sentenceParts[count] + ' <button data-vertical-offset="-20" id="button-text-' + count + '" onClick="updateLevel(' + count + ')" data-jq-dropdown="' + dataCount + '" class="btn btn-primary">_________</button></p>')
		.appendTo(optionsCount);

		// display options well
		$('<div id="data-' + count + '" class="jq-dropdown jq-dropdown-relative"></div>')
		.appendTo(optionsCount);

		// display options in the well
		$("<ul/>", {
			"id": "list",
			"class": "jq-dropdown-menu",
			"onChange": "optionClicked();",
			html: items.join("")
		}).appendTo(dataCount);
	}
	count++;
}

function updateLevel(num) {
	num++;
	if (num != count) {
		count = num;
	}
}

function checkLevels() {
	switch (count) {
		case 0:
			$("#options-1, #options-2").remove();
			break;
		case 1:
			$("#options-1, #options-2").remove();
			break;
		case 2:
			$("#options-2").remove();
			break;
		default:
		//nada
	}
}