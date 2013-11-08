var g_support_local_storage = false;
var mod = 'test';
try {
	localStorage.setItem(mod, mod);
	localStorage.removeItem(mod);
	g_support_local_storage = true;
} catch(e) {
	g_support_local_storage = false;
}

// global variables
var g_selected_action = "";
var g_language = "zh_TW";
var g_icon_view_show_desc = true;

var g_tr_table = {
	"Gloss" : {"en_US":"Gloss", "zh_TW":"亮光", "ja_JP":"光沢"},
	"SemiGloss" : {"en_US":"Semi-Gloss", "zh_TW":"半光", "ja_JP":"半光沢"},
	"Metallic" : {"en_US":"Metallic", "zh_TW":"金屬光澤", "ja_JP":"メタリック"},
	"Flat" : {"en_US":"Flat", "zh_TW":"消光", "ja_JP":"つや消し"},
	"MostFlat" : {"en_US":"3/4 Flat", "zh_TW":"3/4 消光", "ja_JP":"3/4つや消し"},
	"FlatBase" : {"en_US":"Flat Base", "zh_TW":"消光添加劑", "ja_JP":"つや消し添加剤"},
	"Pearl" : {"en_US":"Pearl", "zh_TW":"珍珠光澤", "ja_JP":"パールコート用"},
	"No" : {"en_US":"No", "zh_TW":"編號", "ja_JP":"番号"},
	"Color" : {"en_US":"Color", "zh_TW":"顏色", "ja_JP":"色彩"},
	"Class" : {"en_US":"Class", "zh_TW":"種類", "ja_JP":"種類"},
	"Name" : {"en_US":"Name", "zh_TW":"名稱", "ja_JP":"名称"},
	"Description" : {"en_US":"Description", "zh_TW":"說明", "ja_JP":"解説"},
	"TAMIYA" : {"en_US":"TAMIYA", "zh_TW":"TAMIYA", "ja_JP":"TAMIYA"},
	"TAMIYA Spray" : {"en_US":"TAMIYA Spray", "zh_TW":"TAMIYA 噴罐", "ja_JP":"TAMIYA スプレー"},
	"TAMIYA Approx Color" : {"en_US":"TAMIYA Approx. Color", "zh_TW":"TAMIYA接近色", "ja_JP":"TAMIYA 近似色"},
	"HUMBROL" : {"en_US":"HUMBROL", "zh_TW":"HUMBROL", "ja_JP":"HUMBROL"},
	"Model Master" : {"en_US":"Model Master", "zh_TW":"Model Master", "ja_JP":"Model Master"}
};
function TR(text)
{
	if (g_tr_table[text] == undefined || g_tr_table[text] == "undefined")
		return text;
	if (g_tr_table[text][g_language] == undefined || g_tr_table[text][g_language] == "undefined")
		return text
	return g_tr_table[text][g_language];
}

function model_text(model, key, def_str)
{
	if (model[key][g_language] != undefined && model[key][g_language].length > 0)
		return model[key][g_language];
	if (typeof(model[key]) == "string" && model[key].length > 0)
		return model[key];
	if (def_str != undefined)
		return def_str;
	return "";
}

function get_gradient_style(c1, c2)
{
	if (c1 == c2)
	{
		return "background-color:" + c1;
	}
	else
	{
		var text =
			"background:" + c1 +";" +
			"background: -moz-linear-gradient(-45deg, " + c1 + " 0%, " + c2 +" 50%, " + c1 +" 100%);" +
			"background: -webkit-gradient(linear, left top, right bottom, color-stop(0%," + c1 + "), color-stop(50%," + c2 + "), color-stop(100%," + c1 + "));" +
			"background: -webkit-linear-gradient(-45deg, " + c1 +" 0%," + c2 +" 50%," + c1 + " 100%);" +
			"background: -o-linear-gradient(-45deg, " + c1 + " 0%, " + c2 +" 50%, " + c1 +" 100%);" +
			"background: -ms-linear-gradient(-45deg, " + c1 + " 0%, " + c2 +" 50%, " + c1 +" 100%);" +
			"background: linear-linear-gradient(135deg, " + c1 + " 0%, " + c2 +" 50%, " + c1 +" 100%);" +
			"filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='" + c1 + "', endColorstr='" + c2 + "',GradientType=1 );"
			;
		return text;
	}
}
function storage_get(name)
{
	var storage = undefined;;
	if(g_support_local_storage)
		storage = $.localStorage;
	else
		storage = $.cookieStorage;
	return storage.get(name);
}
function storage_set(name, value)
{
	var storage = undefined;;
	if(g_support_local_storage)
		storage = $.localStorage;
	else
		storage = $.cookieStorage;
	storage.set(name, value);
}

function storage_init()
{
	g_language = storage_get("language");
	if (g_language == undefined)
	{
		g_language = "zh_TW";
		storage_set('language', g_language);
	}
	g_selected_action = storage_get("selected_action");
	if (g_selected_action == undefined)
	{
		g_selected_action = "detail_view";
		storage_set('selected_action', g_selected_action);
	}
	g_icon_view_show_desc = storage_get("icon_view_show_desc");
	if (g_icon_view_show_desc == undefined)
	{
		g_icon_view_show_desc = true;
		storage_set('selected_action', g_icon_view_show_desc);
	}
}

function detail_info_hide()
{
	$('#detail_info_color').hide();
	$('#detail_info').hide();
}

function comment_hide()
{
	$('#comment').hide();
}

function comment_show(msg)
{
	$('#comment').html(msg);
	$('#comment').show();
}

function detail_info_show(number, pos_x, pos_y)
{
	detail_info_hide();

	var e = $('#detail_info');
	var fake_color = $('#detail_info_fake_color');
	var color = $('#detail_info_color');
	var model = g_model_list[number];
	var def_str = 'N/A';
	var text = TR('No') + ':' + number + '<br/>' +
		TR('Class') + ':' + TR(model["Class"]) + '<br/>' +
		TR('Name') + ':' + model_text(model, 'Name', def_str) + '<br/>' +
		TR('Description') + ':' + model_text(model, 'Desc', def_str) + '<br/>' +
		TR('TAMIYA') + ':' + model_text(model, "Tamiya", def_str) + '<br/>' +
		TR('TAMIYA Spray') + ':' + model_text(model, "TamiyaSpray", def_str) + '<br/>' +
		TR('TAMIYA Approx Color') + ':' + model_text(model, "TamiyaClose", def_str) + '<br/>' +
		TR('HUMBROL') + ':' + model_text(model, "Humbrol", def_str) + '<br/>' +
		TR('Model Master') + ':' +model_text(model, "ModelMaster", def_str);
	text += "<br><div style='text-align: right; font-weight: bold;'>Click to Close</div>";
	$('#detail_info_text').html(text);
	color.attr('style', get_gradient_style(model['Color1'], model['Color2']));
	fake_color.attr('style', get_gradient_style(model['Color1'], model['Color2']));

	color.one('click', function() {
		detail_info_hide();
	});

	e.one('click', function(){
		detail_info_hide();
	});

	var screen_width = $(window).width();
	var screen_height = $(window).height();
	if (e.outerWidth() + pos_x >= screen_width)
	{
		pos_x = screen_width - e.outerWidth() - 4;
	}
	e.fadeIn(1, function(){
		var offset = fake_color.offset();
		color
			.width(fake_color.innerWidth())
			.height(fake_color.innerHeight())
			.offset({left: offset.left, top: offset.top})
			.show();
	});
	e.offset({top: pos_y, left: pos_x});

}
function detail_view_page_hide()
{
	detail_info_hide();
}

function detail_view_page()
{
	var content = $("#content");
	var lang = g_language;
	var table_content = "<table id='detail_view_table'>" +
		"<tr><th>" + TR("No") + "</th>" +
		"<th>" + TR("Color") + "</th>" +
		"<th>" + TR("Class") + "</th>" +
		"<th>" + TR("Name") + "</th>" +
		"<th>" + TR("Description") + "</th>" +
		"<th>" + TR("TAMIYA") + "</th>" +
		"<th>" + TR("TAMIYA Spray") + "</th>" +
		"<th>" + TR("TAMIYA Approx Color") + "</th>" +
		"<th>" + TR("HUMBROL") + "</th>" +
		"<th>" + TR("Model Master") + "</th>" +
		"</tr>";

	$('#content').html('');

	for (var number in g_model_list)
	{
		var model = g_model_list[number];
		var desc_text = "";
		var color_style = get_gradient_style(model["Color1"], model["Color2"]);
		if (model["Desc"][g_language] != undefined)
			desc_text = model["Desc"][g_language];
		table_content += "<tr id='row_" + number + "'>" +
			"<td>" + number + "</td>" +
			'<td class="detail_view_color" style="' + color_style + '" id="col_' + number +'"></td>' +
			"<td>" + TR(model["Class"]) + "</td>" +
			"<td>" +  model_text(model, 'Name') + "</td>" +
			"<td>" + model_text(model, 'Desc') + "</td>" +
			"<td>" + model["Tamiya"] + "</td>" +
			"<td>" + model["TamiyaSpray"] + "</td>" +
			"<td>" + model["TamiyaClose"] + "</td>" +
			"<td>" + model["Humbrol"] + "</td>" +
			"<td>" + model["ModelMaster"] + "</td>" +
			"</tr>";
	}
	table_content += "</table>";
	content.html(table_content);

	$('#detail_view_table tr').not(':first').hover(
		function(e) {
		$(this).css('background', '#FBF8CE');
		},
		function(e) {
			$(this).css('background', '#FFFFFF');
		}
	);
	$('#detail_view_table .detail_view_color').click(function(e) {
		var e = $(this);
		var offset = e.offset();
		var pos_x = offset.left;
		var pos_y = offset.top + e.height() + 2;
		var token = e.attr('id').split('_');
		var model = token[1];
		detail_info_show(model, pos_x, pos_y);

	});

	comment_show("Tip: You can click color field for detailed information");
}

function getRGB(str)
{
	var rgb = [];
	rgb[0] = parseInt(str[1] + str[2], 16);
	rgb[1] = parseInt(str[3] + str[4], 16);
	rgb[2] = parseInt(str[5] + str[6], 16);
	return rgb;
}

function icon_view_page_hide()
{
	detail_info_hide();
	$('#icon_view_show_desc').hide();
}

function icon_view_page()
{
	$('#content').html('');
	getRGB("#FF3ADA");
	var content = "<div id='icon_view_list' style='display:none;'><ul>";
	for (var number in g_model_list)
	{
		var model = g_model_list[number];
		var color_style = get_gradient_style(model["Color1"], model["Color2"]);
		var item_class = "icon_view_item";
		rgb = getRGB(model["Color1"]);
		if ((rgb[0] + rgb[1] + rgb[2]) < 300)
			item_class += ' light_text';
		else
			item_class += ' dark_text';
		content += "<li class='" + item_class + "' id='item_" + number + "' style='" + color_style + "'>" +
			"<span style='font-weight:bold;font-size:1.2em;'>" + number + "</span>";
		
		if (g_icon_view_show_desc)
			content += '<br /><span>' + model_text(model, 'Name') + '</span>';
		content +="</span></li>";
	}
	content += "</ul><div class='clearfix'></div></div>";
	$('#content').html(content);
	//$('#icon_view_list').show("show");
	$('#icon_view_list').fadeIn(600);
	if (!g_icon_view_show_desc)
	{
		$('#icon_view_list li').css('line-height', '80px');
	}
	$('#icon_view_list li').click(
		function() {
			var e = $(this);
			var show_detail = e.data('show_detail');
			if (show_detail == undefined)
			{
				show_detail = false;
				e.data('show_detail', show_detail);
			}
			if (show_detail)
			{
				detail_info_hide();
				e.data('show_detail', false);
				return;
			}
			else
			{
				e.data('show_detail', true);
			}
			var offset = e.offset();
			var pos_x = offset.left + e.width() / 2;
			var pos_y = offset.top + e.height() / 2;
			var token = e.attr('id').split('_');
			var model = token[1];
			detail_info_show(model, pos_x, pos_y);
		}
	)
	.hover(
		function() {},
		function() {
			var e = $(this);
			e.data('show_detail', false);
		}
	);
	$('#icon_view_show_desc').show();
	comment_show("Tip: You can click item for detailed information");
}

function content_update()
{
	if (g_selected_action == "detail_view")
	{
		icon_view_page_hide();
		detail_view_page();
	}
	else if (g_selected_action == "icon_view")
	{
		detail_view_page_hide();
		icon_view_page();
	}
}

function view_action_select(selected_action_id, view_actions)
{
	for (var i in view_actions)
	{
		var id = view_actions[i].attr("id");
		view_actions[i].attr("src", "icons/" + id + ".png");
	}
	var action = $("#"+selected_action_id);
	action.attr("src", "icons/" + selected_action_id + "_selected.png");
	storage_set('selected_action', selected_action_id);
	g_selected_action = selected_action_id;
	content_update();
}

function language_init()
{
	// set language from local storage
	$("#language option[value="+g_language+"]").attr("selected","selected");
	// set lauguage change event callback
	$("#language").change(function(e) {
		g_language = $(this).val();
		storage_set('language', g_language);
		content_update();
	});
}

function setting_init()
{
	storage_init();

	var view_actions = [];
	view_actions[0] = $('#detail_view');
	view_actions[1] = $('#icon_view');

	// select current view action
	view_action_select(g_selected_action);

	/* init lauguage setting */
	language_init();

	// register click callback for each view action
	for(var i in view_actions)
	{
		view_actions[i].click(function(e) {
			view_action_select($(this).attr('id'), view_actions);
		});
	}

	var show_desc = $('#icon_view_show_desc_cb');
	show_desc.prop('checked', g_icon_view_show_desc);
	show_desc.change(function() {
		g_icon_view_show_desc = $(this).prop('checked');
		storage_set('icon_view_show_desc', g_icon_view_show_desc);
		icon_view_page();
	});


}

function window_resize_handler()
{
	var content = $('#content');
	content.css('height', $(window).height() - 130);
	$(window).resize(function() {
		detail_info_hide();
		content.css('height', $(window).height() - 130);
	});
}
