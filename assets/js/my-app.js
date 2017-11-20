var myApp = new Framework7({
    animateNavBackIcon:true
});

//app init from template
var $$ = Dom7;
var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true,
    domCache: true
});

//clear previous input
myApp.onPageReinit("finduser", function(page){
    $$(page.container).find("input[type=text], input[type=tel]").each((i,e) => {
	e.value = "";
    });
});


//users list reloading for managment page
myApp.onPageInit("manage", function(page){
    reloadUsersList(page);
});

myApp.onPageReinit("manage", function(page){
    reloadUsersList(page);
});

function reloadUsersList(page){
    $$.getJSON('/api/phone/find?getall=true', function (data) {

	if(data.error == false){
	    //clear previously inserted items
	    var list = $$(page.container).find("#manage_list");
	    list.children('li').each((i, e) => {
		e.remove();
	    });

	    $$.each(data.result, (i,e) => {
		var item = '<li><a href="manageuser.html?id=' + e._id + '&name=' + e.name + '&number=' + e.number +
			'" class="item-link item-content">'+
			'<div class="item-inner"><div class="item-title">'+
			e.name + ' at ' + e.number + '</div></div></a></li>';

		list.append(item);
	    });
	} else {
	    console.log("error");
	}
    });
}

//user managment page
myApp.onPageInit("manageuser", function(page){
    $$(page.container).find("input[name=new_name]").val(page.query.name);
    $$(page.container).find("input[name=new_number]").val(page.query.number);

    if(typeof page.query.id !== 'undefined'){
	$$(page.container).find("input[name=uid]").val(page.query.id);
    } else { //we're adding new user - hide 'remove' button
	$$(page.container).find('#remove_btn').hide();
	$$(page.container).find('#submit_div').removeClass('col-50').addClass('col-100');;
    }
});

function delete_user(sender){
    var form = $$(sender.form);
    var id = $$(form).find('[name=uid]').val();
    $$.get('/api/phone/remove', {uid: id}, function (data) {
	mainView.router.back();
    });
}

function manage_user(sender){
    var form = $$(sender.form);
    var id = $$(form).find('[name=uid]').val();
    var name = $$(form).find('[name=new_name]').val();
    var number = $$(form).find('[name=new_number]').val();

    $$.get('/api/phone/manage', {uid: id, new_name: name, new_number: number }, function (data) {
	data = JSON.parse(data);
	data.error == true ? myApp.alert(data.message, "Error") : mainView.router.back();
    });
}


//process response from  API gateway
$$('form.ajax-submit').on('form:success', function (e) {
    console.log('ok');
    var xhr = e.detail.xhr;
    var data = JSON.parse(e.detail.data);

    if(data.error == false){
	myApp.alert("Name: " + data.result.name + ", phone number: " + data.result.number, "User info");
    } else {
	myApp.alert(data.message, "User not found");
    }
}).on('form:error', function (e) {
    console.log(e);
});

