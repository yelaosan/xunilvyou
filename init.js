
var cities = {yongding:{name:"永定", lat:24.39, lng:117.00, html:[], marker:[]}, nanjing:{name:"南靖", lat:24.35, lng:117.03, html:[], marker:[]}};
var curCity = "yongding";
var div_map = document.getElementById("map");
var map = new GMap2(document.getElementById("map"));
var con = document.getElementById("listContainer");
var init = false;
var lastTab = 0;
var page = 0;
var limit = 20;
init = true;
var base = "";

initHeight();
initSearchBar();
window.onresize = initHeight;	

function initHeight() {
	var height = 0;
	if (window.innerHeight) {
		height = window.innerHeight;
	} else {
		if ((document.body) && (document.body.clientHeight)) {
			height = document.body.clientHeight;
		}
	}
	if (height < 200) {
		height = 200;
	}
	height -= 20;
	div_map.style.height = height;
	con.style.height = height - 70;
	
	map.checkResize();
	map.setCenter(new GLatLng(cities[curCity].lat, cities[curCity].lng), 12);	
	map.enableScrollWheelZoom();
	map.addControl(new GLargeMapControl());
	map.addControl(new GMapTypeControl());
}

function initSearchBar() {
	var search = document.getElementById("quickSearch");
	var onclickSearch = function () {
		search = document.getElementById("quickSearch");
		if (search.value == "\u8bf7\u8f93\u5165\u641c\u7d22\u7684\u5185\u5bb9") {
			search.value = "";
		}
		search.style.color = "#000";
	};
	window.onSearch = function (event) {
		var search = document.getElementById("quickSearch");
		var data = cities[curCity][types[lastTab]];
		var key = search.value;
		if (!key) {
			selectType(lastTab);
			return;
		}
		var str = "";
		hideTab(curCity, types[lastTab]);
		for (var i = 0; i < data.length; i++) {
			var item = data[i];
			var type = item["type"];
			if (lastTab == 0) {
				type = "all";
			}
			if (item["name"].indexOf(key) != -1) {
				str += "<li id=\"item_" + type + "_" + i + "\" " + "onclick=\"selectMarker('" + type + "', " + i + ")\"" + "onmouseover=\"mouseOverList('" + type + "', " + i + ")\"" + "onmouseout=\"mouseOutList('" + type + "', " + i + ")\"" + ">" + item["name"] + "</li>";
				cities[curCity].marker[types[lastTab]][i].show();
			}
		}
		str = "<ul id=\"ul_" + curCity + "_" + types[lastTab] + "\">" + str + "</ul>";
		con.innerHTML = str;
	};

	GEvent.addDomListener(search, "click", onclickSearch);
	GEvent.addDomListener(search, "keyup", window.onSearch);
	
	window.onSearchBlur = function (event) {
		var search = document.getElementById("quickSearch");
		if (!search.value) {
			search.value = "\u8bf7\u8f93\u5165\u641c\u7d22\u7684\u5185\u5bb9";
			search.style.color = "#999";
		}
	};
	
	GEvent.addDomListener(search, "blur", onSearchBlur);
}

