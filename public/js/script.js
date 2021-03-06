let slot_data;
let View;
let day_id;

get_all_data()

today = new Date();
var dd = today.getDate();
var mm = ("0" + (today.getMonth() + 1)).slice(-2)
var yyyy = today.getFullYear();
var curdate = dd+'-'+mm+'-'+yyyy
var todayDate = yyyy+'-' + mm +'-'+ dd
var cdate = curdate
date = document.querySelector('#date')
date.innerHTML = curdate


function get_all_data(){
	const xhttp = new XMLHttpRequest();
	xhttp.open("GET", "/all/teacher", true);
	xhttp.onload = function() {
	if(this.status == 200){
		var result = JSON.parse(this.responseText);
		for (res in result.result) {
			var op = document.createElement('option')
			op.innerHTML = result.result[res].name
			op.setAttribute('value', result.result[res].ID)
			document.querySelector('#teachers').appendChild(op)
		}
	}
	document.querySelector('#teachers option').setAttribute('selected', 'selected');
	var id = document.getElementById('teachers').value;
	xhttp.open("GET", "/slot/"+id, true);
	xhttp.onload = function() {
	if(this.status == 200){
		var result = JSON.parse(this.responseText);
		slot_data = result;
	}
	else{
		console.log("File not found")
	}
}
xhttp.send();
}
xhttp.send();
}

function view() {
	get_all_data()
	clearcontent("#teachers")
	var value = document.querySelector('#view').value
	if (value == "day") {
		View = "day"
		clearcontent('.day')
		document.querySelector('#date').innerHTML = curdate
		week = document.querySelector('.week')
		month = document.querySelector('.month')
		day = document.querySelector('.day')
		day.style.display = "block"
		week.style.display = "none"
		month.style.display = "none"
		document.querySelector('#today1').readOnly=true;
		for(var i=0; i<24;i++) {
			var wrapper = document.createElement('div');
			wrapper.classList.add('time-wrapper');
			var item = document.createElement("div");
			item.innerHTML =  i +":00";
			item.classList.add("time");
			wrapper.appendChild(item);
			var item1 = document.createElement("div");
			item1.classList.add("time-wrap");
			if(i < 10){
				item1.id = '0'+i
			}
			else{
				item1.id = i
			}
			wrapper.appendChild(item1);
			document.querySelector('.day').appendChild(wrapper);
		}
		view_slot_data()
		document.querySelectorAll('.time-wrapper').forEach(function(i) {
  			i.addEventListener('click', function(event) {
  				var addslot = document.getElementById('addslot')
  				document.getElementById('today1').setAttribute('value', todayDate)
  				var time_wrapper = event.target
  				if(time_wrapper.children.length > 1){
	  				var from_time = time_wrapper.children[1].getAttribute('id')
	  				var to_time = parseInt(from_time) + 1
	  				from_time += ':00'
	  				to_time = to_time < 10 ? '0' + to_time + ':00' : to_time + ':00'
	  				document.getElementById('from_time').setAttribute('value', from_time)
	  				document.getElementById('to_time').setAttribute('value', to_time)
	  				disable()
	  				openModal()
  				}
			})
		})
		document.querySelectorAll('.slot-wrapper').forEach((item) => {
			item.addEventListener('click', function (event) {
				var sid = event.target.id
				var xhttp1 = new XMLHttpRequest();
				xhttp1.open("GET", "/get-slot/"+sid, true);
				xhttp1.onreadystatechange = function() {
					if(this.readyState == 4 && this.status == 200){
						var result = JSON.parse(this.responseText)
						var from_time = formatTime(result[0].from_time)
						var to_time = formatTime(result[0].to_time)
						document.getElementById('task').setAttribute('value', result[0].task)
						document.getElementById('from_time').setAttribute('value', from_time)
		  				document.getElementById('to_time').setAttribute('value', to_time)
		  				enable()
		  				e = document.getElementById(event.target.id)
		  				del_button = document.querySelector('#Dbutton')
		  				del_button.onclick = function(){
		  					Delete(sid, e)
		  				}
		  				openModal()
					}
				}
				xhttp1.send()

			})
		})

	}
	if (value == "week"){
		clearcontent('.week')
		View = "week"
		document.querySelector('#date').innerHTML = "Jun 2021"
		week = document.querySelector('.week')
		month = document.querySelector('.month')
		day = document.querySelector('.day')
		day.style.display = "none"
		week.style.display = "block"
		month.style.display = "none"
		document.querySelector('#today1').readOnly=false;
		var row1_div = document.createElement('div')
		row1_div.classList.add("row1")
		var row_div = document.createElement('div')
		row_div.classList.add("row")
		var d = new Date()
		var today = d.getDate()
		var day = d.getDay()
		var month = d.getMonth()+1
		var list = ["Sunday","Monday","Tuesday","Wednesday ","Thursday","Friday", "Saturday"]
		for(var i=0; i<7; i++){
			var new_row = document.createElement('div')
			new_row.classList.add("column")
			var new_col = document.createElement('div')
			new_col.classList.add("column")
		    new_col.setAttribute('id', day)
		    new_col.setAttribute('value', today)
		    new_col.innerHTML = list[day]
		    new_row.innerHTML = today
		    day = (day+1)%7;
		    if(month == 2){
		    	if(today == 28){
		        	today =0
		        }
		        today++;
		    }
		    if(month == 1 || month == 3 || month == 5 || month == 7 || month == 8|| month == 10 || month == 12){
		    if(today == 31){
		        	today =0
		        }
		        today++;
		    }
		    if(month == 4 || month == 6 || month == 9 || month == 11){
		    if(today == 30){
		        	today =0
		        }
		        today++;
		    }
		    row1_div.appendChild(new_row);
			row_div.appendChild(new_col);
		}
		document.querySelector('.week').appendChild(row_div)
		document.querySelector('.week').appendChild(row1_div)
		view_slot_data()
		document.querySelector('.week').appendChild(row1_div)
		document.querySelector('.week').appendChild(row_div)
		document.querySelectorAll('.column').forEach(function(i) {
  			i.addEventListener('click', function(event){
  				day_id = event.target.id;
  				disable()
				openModal();
			})
  		})
  		setTimeout(function(){
  			console.log(document.querySelector('.slot-col1'))
  			document.querySelectorAll('.slot-col1').forEach((item) => {
			item.addEventListener('click', function (event) {
				var sid = event.target.id
				e = document.getElementById(event.target.id)
				var xhttp1 = new XMLHttpRequest();      
				xhttp1.open("GET", "/get-slot/"+sid, true);
				xhttp1.onreadystatechange = function() {
					if(this.readyState == 4 && this.status == 200){
						var result = JSON.parse(this.responseText)
						var from_time = formatTime(result[0].from_time)
						var to_time = formatTime(result[0].to_time)
						document.getElementById('today1').setAttribute('value', '')
						document.getElementById('task').setAttribute('value', result[0].task)
						document.getElementById('from_time').setAttribute('value', from_time)
		  				document.getElementById('to_time').setAttribute('value', to_time)
		  				enable()
		  				e = document.getElementById(event.target.id)
		  				del_button = document.querySelector('#Dbutton')
		  				del_button.onclick = function(){
		  					Delete(sid, e)
		  				}
		  				openModal()
					}
				}
				xhttp1.send()
			})
		})
  	}, 500)
  	}
	if (value == "month"){
		document.querySelector('#date').innerHTML = "Jun 2021"
		week = document.querySelector('.week')
		month = document.querySelector('.month')
		day = document.querySelector('.day')
		day.style.display = "none"
		week.style.display = "none"
		month.style.display = "block"
		document.querySelectorAll('.calendar-wrapper .days div div').forEach((item) => {
		item.addEventListener('click', function () {
		var slot_area = document.createElement('div')
		slot_area.classList.add('slot-area')
		slot_area.innerHTML = 'title'
		item.querySelector('.slot0').appendChild(slot_area)
	});
});
	}
}


var addslot = document.getElementById('addslot')
var button = document.getElementById('button')
var close = document.querySelector('.close')
button.onclick = function() {
	document.getElementById('today1').setAttribute('value', todayDate)
	disable()
	openModal()
}
close.onclick = function(){
	closeModal()
}
window.onclick = function(event) {
  if (event.target == addslot) {
    closeModal()
  }
}

setTimeout(function() {
	document.querySelector('#tid').setAttribute('value', document.querySelector('#teachers').value);
	view()
}, 500)
document.querySelector('#teachers').addEventListener('change', function (event) {
	document.querySelector('#tid').setAttribute('value', event.target.value);
})



function submitHandler(event) {
	event.preventDefault()
	if (mm < 10) {
		var date = yyyy + '-' + '0' + mm + '-' + dd
	}
	else{
		var date = yyyy + '-' + mm + '-' + dd
	}
	var task = document.querySelector('#task').value
	var id = document.querySelector('#tid').value
	var from_time = document.querySelector('#from_time').value
	var to_time = document.querySelector('#to_time').value
	var todayDate = document.querySelector('#today1').value
	var td = new Date(todayDate)
	td = td.getDay()
	day_id = td
	from_time = todayDate + ' ' + from_time
	to_time = todayDate + ' ' + to_time
	var xhttp1 = new XMLHttpRequest(); 
	var count = 0;
	xhttp1.open("GET", "/validate/slot/"+id+"/"+from_time+"/"+to_time, true);
	xhttp1.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200){
			var results = JSON.parse(this.responseText);
			if (results.result !== null) {
				for (resu in results.result) {
					if (id == results.result[resu].TEACHER_ID) {
						count++;
					}
				}
			}
		}
	}
	xhttp1.send()
	setTimeout(function () {
		if (count > 0) {
			error('Slot already booked.')
			return
		}
		var split_from = from_time.split(":");
		var split_to = to_time.split(":")
		if(split_from[0] == split_to[0]){
			if(split_from[1] >= split_to[1]){
				error("From time must always be less than to time.")
				return
			}
		}
		else if(split_from[0] > split_to[0]){
			error("From time must always be less than to time.")
			return
		}

		const json = {
			"task": task,
			"from_time": from_time,
			"to_time": to_time,
			"teacher_id": id
		}

		xhttp1.open("POST", "/slot/schedule", true);
		xhttp1.setRequestHeader('Content-Type','application/json')
		xhttp1.onload = function() {
			if(this.status == 200){
				var result = JSON.parse(this.responseText);
				if(result.affectRows == 1) {
					set_slot(result.sid, task, from_time, to_time)
				}
				closeModal()

			}
		}
		xhttp1.send(JSON.stringify(json));
	}, 1000)
}

function convertDate(time){
	var d = new Date(time);
	d = d.toString()
	d = d.slice(16, 21)
	return(d);
}

xhttp2 = new XMLHttpRequest()
function teach(){
	if(View == 'day'){
		document.querySelectorAll('.slot-wrapper').forEach(e => e.parentNode.removeChild(e));
	}
	if(View == 'week'){
		document.querySelectorAll('.slot-col1').forEach(e => e.remove());
	}
	var teacher_value = document.getElementById('teachers').value
	xhttp2.open("GET", "/slot/"+teacher_value, true);
	xhttp2.onload = function() {
	if(this.status == 200){
		var result = JSON.parse(this.responseText);
		slot_data = result;
		view_slot_data()

	}
	else{
		console.log("File not found")
	}
}
xhttp2.send();
}

function view_slot_data(){
	if (View == 'day'){
		for (s in slot_data) {
			f_time = slot_data[s].from_time
			var d = new Date(f_time);
			var match_date = get_date(d.toString())
			t_time = slot_data[s].to_time;
			if(match_date == todayDate.slice(8,10)){
				id = slot_data[s].SID
				task = slot_data[s].task
				set_slot(id, task, f_time, t_time)
			}
		}
	}
	if (View == 'week'){
		var c = 0;
		var day = new Date()
		day_id = day.getDay()
		setTimeout(function(){
			while(c < 7){
				for (s in slot_data) {
					cdate = document.getElementById(day_id)
					cdate = cdate.getAttribute('value')
					if(cdate < 10){
						cdate = '0'+cdate
					}
					f_time = slot_data[s].from_time
					var d = new Date(f_time);
					var match_date = get_date(d.toString())
					if(match_date == cdate){
						t_time = slot_data[s].to_time;
						id = slot_data[s].SID
						task = slot_data[s].task
						set_slot(id, task, f_time, t_time)
					}
				}
				if(day_id == 6){
					day_id = -1
				}
				day_id++;
				c++;
			}
		}, 500)
	}
}
function set_slot(id, task, f_time, t_time) {
	d = convertDate(f_time)
	time_id = d.slice(0, 2)
	t = convertDate(t_time)
	var batch = document.createElement("div");
	if(View == "day"){
			batch.classList.add('slot-wrapper')
			batch.setAttribute('id', id)
			s_slot = document.getElementById(time_id)
			batch.innerHTML = "Lecture of "+task+" at "+d+" till "+t;
			s_slot.appendChild(batch);
		}
	if( View == "week"){
		batch.classList.add('slot-col1')
		batch.setAttribute('id', id)
		batch.innerHTML = "Lecture of "+task+" at "+d+" till "+t;
		//console.log(document.getElementById(day_id))
		document.getElementById(day_id).appendChild(batch);
	}
	else
	{
		console.log()
	}
}
function error(message){
	document.querySelector(".error").innerHTML = message
}

function openModal() {
	addslot.style.display = "block"
	document.querySelector('.error').innerHTML = ''
    addslot.style.display = "flex"
}

function closeModal() {
	document.getElementById('task').setAttribute('value', "")
	document.getElementById('from_time').setAttribute('value', "")
	document.getElementById('to_time').setAttribute('value', "")
	addslot.style.display = "none"

}

function formatTime(time) {
	time = new Date(time)
	var hours = time.getHours()
	var minutes = time.getMinutes()
	hours = hours < 10 ? '0' + hours : hours
	minutes = minutes < 10 ? '0' + minutes : minutes
	return hours + ':' + minutes
}
function clearcontent(clear_id) {
    document.querySelector(clear_id).innerHTML = "";
    }
function get_date(x){
	x = x.slice(8, 10)
	return(x)
}
function rev(str) {
    let newString = "";
    for (let i = str.length - 1; i >= 0; i--) {
        newString += str[i];
    }
    return newString;
}
function disable() {
    document.getElementById("Dbutton").style.disable = true;
    document.getElementById("Dbutton").style.display = "none";
}

function enable() {
    document.getElementById("Dbutton").disabled = false;
    document.getElementById("Dbutton").style.display = "block";
}
function Delete(sid, e){
	e.innerHTML = ""
	const xhttp_del = new XMLHttpRequest()
	xhttp_del.open("DELETE", '/delete/slot/'+sid, true);
	xhttp_del.onload = function() {
		if(this.status == 200){
			closeModal()
		}
		else{
			console.log("File not found")
		}
	}
	xhttp_del.send();
	get_all_data()
}