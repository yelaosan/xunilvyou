
var iconType = {};
var iconType0 = {};
var icons = [""];
var icons0 = [""];
window.onload = function () {
	for (var i = 0; i < types.length; i++) {
		iconType[types[i]] = icons[i];
		iconType0[types[i]] = icons0[i];
	}
};
var init = false;
var lastTab = 0;
var page = 0;
var limit = 20;
selectType(1);
init = true;
window.cities = cities;
window.types = types;
window.curCity = curCity;
window.lastTab = lastTab;
window.map = map;
window.page = page;
window.limit = limit;

function selectType(i) {
	con.innerHTML = "<div class=\"hint-msg\"><img src=\"" + base + "loading.gif\"/>&nbsp;loading...</div>";
	hideTab(curCity, types[lastTab]);
	document.getElementById("tab_" + lastTab).className = "";
	if (cities[curCity].marker[types[lastTab]]) {
		for (var j = 0; j < cities[curCity].marker[types[lastTab]].length; j++) {
			cities[curCity].marker[types[lastTab]][j].hide();
		}
	}
	document.getElementById("tab_" + i).className = "selected";
	lastTab = i;
	if (!cities[curCity].marker[types[lastTab]]) {
		if ((lastTab != 0) && (window.reqTab == 0)) {
			if (initInfo[curCity][lastTab] == 0) {
				var url = "data/" + curCity + "_" + tabMap[i] + ".json";
				initInfo[curCity][lastTab] = 1;
				window.reqTab = lastTab;
				GDownloadUrl(url, onTypeData);
			}
			return;
		} else {
			if (lastTab == 0) {
				checkLoading();
				return;
			}
		}
	} else {
		if (lastTab == 0) {
			checkLoading();
		}
	}
	if ((i != 0) && cities[curCity].html[types[i]]) {
		con.innerHTML = cities[curCity].html[types[i]];
	}
	if (cities[curCity].marker[types[lastTab]]) {
		for (var j = 0; j < cities[curCity].marker[types[lastTab]].length; j++) {
			cities[curCity].marker[types[lastTab]][j].show();
		}
	}
}

function onTypeData(data) {
	var data = eval(data);
	if (!data) {
		return;
	}
	
	if (!cities[curCity].all) {
		cities[curCity]["all"] = [];
		cities[curCity].html["all"] = [];
		cities[curCity].marker["all"] = [];
	}
	cities[curCity][types[reqTab]] = data;
	cities[curCity].html[types[reqTab]] = [];
	cities[curCity].marker[types[reqTab]] = [];
	for (var i = 0; i < data.length; i++) {
		var len = i;
		var type = types[reqTab];
		
		var item = data[i];
		item["type"] = types[reqTab];
		var g = item.g.split(",");
		item["lat"] = parseFloat(g[1]);
		item["lng"] = parseFloat(g[0]);
		item["name"] = item.n;
		item["image"] = item.i;
		item["desc"] = item.d;
		
		cities[curCity].html[item["type"]] += "<li id=\"item_" + item["type"] + "_" + len + "\" " + "onclick=\"selectMarker('" + item["type"] + "', " + cities[curCity].marker[item["type"]].length + ")\"" + "onmouseover=\"mouseOverList('" + item["type"] + "', " + cities[curCity].marker[item["type"]].length + ")\"" + "onmouseout=\"mouseOutList('" + item["type"] + "', " + cities[curCity].marker[item["type"]].length + ")\"" + ">" + item["name"] + "</li>";
		
		var point = new GLatLng(item["lat"], item["lng"]);
		var icon = new GIcon();
		icon.image = "img/" + iconType[item["type"]];
		icon.iconSize = new GSize(36, 51);
		icon.iconAnchor = new GPoint(18, 51);
		icon.infoWindowAnchor = new GPoint(10, 6);
		var marker = new GMarker(point, {icon:icon, title:item["name"]});
		marker.point = point;
		
		map.addOverlay(marker);
		cities[curCity].marker[item["type"]].push(marker);
		
		GEvent.addListener(marker, "click", GEvent.callbackArgs(this, openInfoWindow, marker, item, len));
		GEvent.addListener(marker, "mouseover", GEvent.callbackArgs(this, highlightPos, marker, item, len));
		GEvent.addListener(marker, "mouseout", GEvent.callbackArgs(this, unhighlightPos, marker, item, len));

		cities[curCity].html["all"] += "<li id=\"item_all_" + cities[curCity]["all"].length + "\"" + "onclick=\"selectMarker('all', " + cities[curCity].marker["all"].length + ")\"" + "onmouseover=\"mouseOverList('all', " + cities[curCity].marker["all"].length + ")\"" + "onmouseout=\"mouseOutList('all', " + cities[curCity].marker["all"].length + ")\"" + ">" + item["name"] + "</li>";
		cities[curCity]["all"].push(item);
		cities[curCity].marker["all"].push(marker);
	}
	cities[curCity].html[types[reqTab]] = "<ul id=\"ul_" + curCity + "_" + types[reqTab] + "\">" + cities[curCity].html[types[reqTab]] + "</ul>";
	cities[curCity].html["allul"] = "<ul id=\"ul_" + curCity + "_all\">" + cities[curCity].html["all"] + "</ul>";
	reqTab = 0;

	if (window.checking) {
		window.checkLoading();
	} else {
		selectType(lastTab);
	}
}

function openInfoWindow(marker, item, i) {
	

	var img = new Image();
	img.src = item["image"];
	img.onload = onImgLoaded(img.src, "loaded");
	img.onerror = onImgLoaded(img.src, "error");
	
	var tabs = [];
	var imgHtml = "<span style='font-size:13px;'>" + item["name"] + "</span><br/><p style='display: block;font-size: 12px; color: red; padding-right:3px;text-align:right;'><a href='" + img.src + "' alt='\u70b9\u51fb\u67e5\u770b\u539f\u56fe'  target = '_blank' >进入虚拟漫游</a></p><p id='demoimg_" + item["type"] + "_" + i + "'><img src='" + base + "loading.gif'/>&nbsp;loading...</p>";
	var infoHtml = "<div style='width:400px;font-size:13px;'>" + item["desc"] + "</div>";
	var searHtml =  "<div class=\"info-paragraph\">" + 
				"<div class=\"tab-head\">" + 
					"<p class=\"tab-item active-tab\" id=\"near_tab\" onclick=\"onInfoTabClick('near');\" onmouseout=\"this.style.textDecoration='none'\" onmouseover=\"onInfoTabMouseover(this)\">\u5728\u9644\u8fd1\u641c\u7d22</p>" + 
					"<p class=\"tab-item\" id=\"route_tab\" onclick=\"onInfoTabClick('route');\" onmouseout=\"this.style.textDecoration='none'\" onmouseover=\"onInfoTabMouseover(this)\">\u9a7e\u8f66\u8def\u7ebf</p>" +
				    "<p class=\"tab-item\" id=\"transit_tab\" onclick=\"onInfoTabClick('transit');\" onmouseout=\"this.style.textDecoration='none'\" onmouseover=\"onInfoTabMouseover(this)\">\u516c\u4ea4\u8def\u7ebf</p>" + 				 
			    "</div>" + 

				"<div id=\"near_cnt\" class=\"tab-content\" style=\"display:block;\">" + "<p class=\"info-tip\"><span>例如：餐厅 酒店</span></p>" + 
				    "<input type=\"text\" id=\"near_input\" style=\"width:75%\" class=\"gsc-input\" onkeydown=\"inputonkeydown(this, event)\"/>"+
				    "<input type=\"button\" class=\"info-button gsc-search-button\" value=\"\u641c\u7d22\" onclick=\"getNear();\"/>" + 
				"</div>"  + 

			    "<div id=\"route_cnt\" class=\"tab-content\" >" + 		    
				    "<p class=\"info-tip\">" + 
				    "<input type=\"radio\" name=\"route\" id=\"routeFrom\" checked=\"checked\"/>\u8f93\u5165\u76ee\u7684\u5730&nbsp;" + 
				    "<input type=\"radio\" name=\"route\" id=\"routeTo\"/>\u8f93\u5165\u51fa\u53d1\u70b9&nbsp;</p>" + 
				    "<input type=\"text\" id=\"route_input\" style=\"width:75%\" class=\"gsc-input\" onkeydown=\"inputonkeydown(this, event)\"/>"+
				    "<input type=\"button\" class=\"info-button gsc-search-button\" value=\"\u641c\u7d22\" onclick=\"getRoute();\"/>" + 
				    "<p id=\"routeErrMsg\" style=\"display:none;color:#ff0000;margin-top:2px;\">\u6ca1\u6709\u627e\u5230\u6709\u6548\u7ed3\u679c\uff0c<a href=\"\" id=\"moreRouteLink\" target=\"_blank\">\u53bb\u8c37\u6b4c\u5730\u56fe\u4e3b\u9875\u8bd5\u8bd5</a></p>" + 
			    "</div>" + 

			    "<div id=\"transit_cnt\" class=\"tab-content\">" + "<p class=\"info-tip\">" + 

				    "<input type=\"radio\" name=\"transit\" id=\"transitFrom\" checked=\"checked\"/>\u8f93\u5165\u76ee\u7684\u5730&nbsp;" + 

				    "<input type=\"radio\" name=\"transit\" id=\"transitTo\"/>\u8f93\u5165\u51fa\u53d1\u70b9&nbsp;</p>" + 

				    "<input type=\"text\" id=\"transit_input\" style=\"width:52%\" class=\"gsc-input\" onkeydown=\"inputonkeydown(this, event)\"/>" + 

				    "&nbsp;<a class=\"info-button gsc-search-button\" style=\"border:none;\" href=\"javascript:getTransit();\">\u53bb\u5730\u56fe\u4e3b\u9875\u641c\u7d22</a>" + 
				"</div>" + 			    
		    "</div>";
	
	tabs.push(new GInfoWindowTab("虚拟漫游", imgHtml));
	tabs.push(new GInfoWindowTab("景点介绍", infoHtml));
	tabs.push(new GInfoWindowTab("查询搜索", searHtml));

	marker.openInfoWindowTabsHtml(tabs);
	
	function onImgLoaded(src, type) {
		return function () {
			tabs = [];
			if (type == "loaded") {
				var css = "";
				var width = img.width;
				var height = img.height;
				var rw = width / 350;
				var rh = height / 250;
				var r = 1;
				r = (rw > rh) ? rw : rh;
				if (r < 1) {
					r = 1;
				}
				img.height = height / r;
				img.width = width / r;
				css = "height:" + img.height + ";width:" + img.width + ";";
				imgHtml = "<span style='font-size:13px;'>" + item["name"] + "</span><br/><p style='display: block;font-size: 12px; color: red; padding-right:3px;text-align:center;'><a href='" + img.src + "' alt='\u70b9\u51fb\u67e5\u770b\u539f\u56fe'  target = '_blank' >进入虚拟漫游</a></p><div style='width: 400px;text-align:center; height:250px;'><a href='" + img.src + "' alt='\u70b9\u51fb\u67e5\u770b\u539f\u56fe'  target = '_blank' ><img style='padding:0;margin:0;border:0;width: 400px;" + css + "' alt='preview' src='" + img.src + "'/></a></div>";
				infoHtml = "<div style='width:400px;font-size:13px;'>" + item["desc"] + "</div>";
				tabs.push(new GInfoWindowTab("虚拟漫游", imgHtml));
				tabs.push(new GInfoWindowTab("景点介绍", infoHtml));
				tabs.push(new GInfoWindowTab("查询搜索", searHtml));
				marker.openInfoWindowTabsHtml(tabs);
			} else {
				imgHtml = "<span style='font-size:13px;'>" + item["name"] + "</span><br/><span style='display: block;font-size: 12px; color: red; padding-top:30px;text-align:center;'>\u56fe\u7247\u52a0\u8f7d\u5931\u8d25</span><br/><a  style='display: block;font-size: 12px; color: blue; padding-top:30px;text-align:center;' target = '_blank' href='" + img.src + "'>\u67e5\u770b\u539f\u94fe\u63a5</a>";
				infoHtml = "<div style='width:400px;font-size:13px;'>" + item["desc"] + "</div>";
				tabs.push(new GInfoWindowTab("\u56fe\u7247", imgHtml));
				tabs.push(new GInfoWindowTab("\u4fe1\u606f", infoHtml));
				marker.openInfoWindowTabsHtml(tabs);
			}
		};
	}
}

function highlightPos(marker, item, i) {
	var url = "img/" + iconType0[item["type"]];
	if (window.all) {
		document.getElementById("item_all_" + window.idx).className = "over";
		window.all = false;
	} else {
		if (lastTab != 0) {
			document.getElementById("item_" + item["type"] + "_" + i).className = "over";
		}
	}
	marker.setImage(url);

	if (!map.getBounds().contains(marker.point)) {
		map.panTo(marker.point);
	}
}

function unhighlightPos(marker, item, i) {
	var url = "img/" + iconType[item["type"]];
	if (window.all) {
		document.getElementById("item_all_" + window.idx).className = "";
		window.all = false;
	} else {
		if (lastTab != 0) {
			document.getElementById("item_" + item["type"] + "_" + i).className = "";
		}
	}
	marker.setImage(url);
}

function selectMarker(type, i) {
	GEvent.trigger(cities[curCity].marker[type][i], "click");
}

function mouseOverList(type, i) {
	if (type == "all") {
		window.all = true;
		window.idx = i;
		document.getElementById("item_all_" + window.idx).className = "over";
		window.all = false;
	} else {
		if (lastTab != 0) {
			document.getElementById("item_" + type + "_" + i).className = "over";
		}
	}
}

function mouseOutList(type, i) {
	if (type == "all") {
		window.all = true;
		window.idx = i;
		document.getElementById("item_all_" + window.idx).className = "";
		window.all = false;
	} else {
		if (lastTab != 0) {
			document.getElementById("item_" + type + "_" + i).className = "";
		}
	}
}

