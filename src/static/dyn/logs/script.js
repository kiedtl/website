var logs = ""

$("#loadbtn").click(function() {
	$.ajax({url: "https://tilde.team/~kiedtl/dyn/logs.php", success: function(result) {
		logs = result;
 	}});
});

$("#loadbtn").click(function() {
	display(logs);
	$("#loadbtn").hide();
});

function display(data) {
	$.each(data.split('\n'), function(idx, val) {
		if (val == '') {
			return;
		}
		arr = val.split(' ');
		result = arr.slice(0, 2);
		result.push(arr.slice(2).join(' '));
		
		ch = result[0].split(''); // date time chars
		console.log(ch);
		datetime = new Date(Date.parse(`${ch[2]}${ch[3]}/${ch[0]}${ch[1]}/${ch[4]}${ch[5]} ${ch[6]}${ch[7]}:${ch[8]}${ch[9]}`));
		
		$('#content > tbody:last-child').append(`<tr><td class="item-date">${datetime.getFullYear()}-${datetime.getMonth()}-${datetime.getDate()} ${datetime.getHours()}:${datetime.getMinutes()}</td><td class="item-source">&lt;<b>${result[1]}</b>&gt;</td><td>${result[2]}</td></tr>`);
	});
}
