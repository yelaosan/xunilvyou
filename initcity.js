
var types = ["全部", "永定", "靖安"];
var typeNames = ["全部", "永定", "靖安"];
var tabMap = [0, 1, 2];
window.initInfo = {yongding:[0, 0, 0], nanjing:[0, 0, 0]};
window.reqTab = 0;
window.checking = false;
initTabs();
function initTabs() {
	var root = document.getElementById("tabHead");
	for (var i = 0; i < types.length; i++) {
		root.innerHTML += "<a href=\"javascript:selectType('" + i + "')\" title=\"" + typeNames[i] + "\" id=\"tab_" + i + "\">" + typeNames[i] + "</a>";
	}
	document.getElementById("tab_0").className = "selected";
}

function hideTab(city, type) {
	if (cities[city].marker[type]) {
		for (var j = 0; j < cities[city].marker[type].length; j++) {
			cities[city].marker[type][j].hide();
		}
	}
}

function checkLoading() {
	window.checking = true;
	for (var i = 1; i < initInfo[curCity].length; i++) {
		if ((window.reqTab == 0) && (initInfo[curCity][i] == 0)) {
			var url = "data/" + curCity + "_" + tabMap[i] + ".json";
			initInfo[curCity][i] = 1;
			window.reqTab = i;
			GDownloadUrl(url, onTypeData);
			return false;
			break;
		}
	}
	if (cities[curCity].html["allul"] && lastTab == 0) {
		con.innerHTML = cities[curCity].html["allul"];
	}
	window.checking = false;
	return true;
}

