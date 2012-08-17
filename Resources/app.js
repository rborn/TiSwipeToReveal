var win = Ti.UI.createWindow({
	backgroundColor:'#fff'
});

var lorem = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

var tbl = Ti.UI.createTableView({
	backgroundColor:'#fff',
	minRowHeight: 70,
	selectionStyle: 'none'
});

var current_row; // this will hold the current row we swiped over, so we can reset it's state when we do any other gesture (scroll the table, swipe another row, click on another row)

var make_actions_view = function(where) { // create the actions view - the one will be revealed on swipe
	
	var view = Ti.UI.createView({
		height:Ti.UI.SIZE,
		width:Ti.UI.SIZE
	});

	for (var i = 0; i < 6; i++) {
		view.add(Ti.UI.createImageView({
			width: '50dp',
			left: (10 + (50 * i))+'dp',
			height: '50dp',
			image: 'KS_nav_ui.png',
			is_action: 'action ' + i
		}));
	};

	return view;
};

var make_content_view = function(chars) {// create the content view - the one is displayed by default

	var view = Ti.UI.createView({
		backgroundColor: '#fff',
		height: Ti.UI.SIZE
	});

	var img = Ti.UI.createImageView({
		height: '40dp',
		width: '40dp',
		left: '5dp',
		top: '5dp',
		image: 'https://si0.twimg.com/profile_images/2179402304/appc-fb_normal.png'
	});

	var label = Ti.UI.createLabel({
		text: lorem.slice(0, chars),
		color:'#000',
		top: 0,
		left: '50dp',
		right: '5dp',
		height: Ti.UI.SIZE
	});

	view.add(img);
	view.add(label);

	return view;

};




function make_data_rows() { // some stub data for the rows.
	var data = [];

	for (var i = 0; i < 15; i++) {

		var randVal = parseInt(50 + (Math.random() * (lorem.length - 50)), 10);

		var row = Ti.UI.createTableViewRow({
			height: Ti.UI.SIZE,
			backgroundColor:'#fff'
		});

		var v1 = make_actions_view();
		row.v2 = make_content_view(randVal);
		row.add(v1);
		row.add(row.v2);


		// android behaves in a different way so we need to add the event to the row.
		
		row.addEventListener('swipe', function(e) {
			
			if (!!current_row) {
				current_row.v2.animate({
					opacity: 1,
					duration: 500
				});
			};

			current_row = Ti.Platform.osname == 'android' ? this : e.row; // it looks like android does not have the e.row property for this event.

			current_row.v2.animate({
				opacity: 0,
				duration: 500
			});
		});

		data.push(row);
	};
	tbl.setData(data);
}

make_data_rows();


if (Ti.Platform.osname == 'android') {

	var scrolled_times = 0;

	tbl.addEventListener('scrollEnd', function(e) {
		scrolled_times = 0;
	});

}

tbl.addEventListener('scroll', function(e) {


	if (!!current_row && (Ti.Platform.osname == 'android' ?  scrolled_times > 3 : true)) {
		current_row.v2.animate({
			opacity: 1,
			duration: 500
		});
		current_row = null;
	}
	
	scrolled_times++;
});

tbl.addEventListener('click', function(e) {
	if (e.source.is_action) {
		alert(e.source.is_action);
	} else {
		alert('row clicked');
		if (current_row) {
			current_row.v2.animate({
				opacity: 1,
				duration: 500
			});
			current_row = null;
		}

	}
});

win.add(tbl);
win.open();
