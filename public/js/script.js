let slot_data;
let View;
let day_id;


today = new Date();
var dd = today.getDate();
var mm = ("0" + (today.getMonth() + 1)).slice(-2)
var yyyy = today.getFullYear();
var curdate = dd+'-'+mm+'-'+yyyy
var todayDate = yyyy+'-' + mm +'-'+ dd
var cdate = curdate
date = document.querySelector('#date')
date.innerHTML = curdate



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

function view() {
	var value = document.querySelector('#view').value
	View = value
	if (value == "day") {
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
	  				openModal()
  				}
			})
		})
		document.querySelectorAll('.slot-wrapper').forEach((item) => {
			item.addEventListener('click', function (event) {
				var sid = event.target.id
				console.log(event.target.id)
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
		  				openModal()
					}
				}
				xhttp1.send()

			})
		})

	}
	if (value == "week"){
		week = document.querySelector('.week')
		month = document.querySelector('.month')
		day = document.querySelector('.day')
		day.style.display = "none"
		week.style.display = "block"
		month.style.display = "none"
		document.querySelector('#today1').readOnly=false;
		var d = new Date()
		var today = d.getDate()
		var day = d.getDay()
		var month = d.getMonth()
		var list = ["Sunday","Monday","Tuesday","Wednesday ","Thursday","Friday", "Saturday"]
		for(var i=0; i<7; i++){
			var column = document.querySelector(".row")
		    var r = document.querySelector('.row1')
			var new_row = document.createElement('div')
			new_row.classList.add("column")
			var new_col = document.createElement('div')
			new_col.classList.add("column")
		    new_col.setAttribute('id', day)
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
		    r.appendChild(new_row);
			column.appendChild(new_col);
		}
		document.querySelectorAll('.column').forEach(function(i) {
  			i.addEventListener('click', function(event){
  				day_id = event.target.id;
				openModal();
			})
  		})
  	}
	if (value == "month"){
		week = document.querySelector('.week')
		month = document.querySelector('.month')
		day = document.querySelector('.day')
		day.style.display = "none"
		week.style.display = "none"
		month.style.display = "block"
	}
}
var addslot = document.getElementById('addslot')
var button = document.getElementById('button')
var close = document.querySelector('.close')
button.onclick = function() {
	document.getElementById('today1').setAttribute('value', todayDate)
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

	from_time = todayDate + ' ' + from_time
	to_time = todayDate + ' ' + to_time

	var xhttp1 = new XMLHttpRequest(); 
	var count = 0;
	xhttp1.open("GET", "/validate/slot/"+id+"/"+from_time+"/"+to_time, true);
	xhttp1.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200){
			var results = JSON.parse(this.responseText);
			if (results.result.length > 0) {
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

		xhttp.open("POST", "/slot/schedule", true);
		xhttp.setRequestHeader('Content-Type','application/json')
		xhttp.onload = function() {
			if(this.status == 200){
				var result = JSON.parse(this.responseText);
				if(result.affectRows == 1) {
					set_slot(result.sid, task, from_time, to_time)
				}
				closeModal()

			}
		}
		xhttp.send(JSON.stringify(json));
	}, 1000)
}

function convertDate(time){
	var d = new Date(time);
	d = d.toString()
	d = d.slice(16, 21)
	return(d);
}
function teach(){
	document.querySelectorAll('.slot-wrapper').forEach(e => e.parentNode.removeChild(e));
	var teacher_value = document.getElementById('teachers').value
	xhttp.open("GET", "/slot/"+teacher_value, true);
	xhttp.onload = function() {
	if(this.status == 200){
		var result = JSON.parse(this.responseText);
		slot_data = result;
		view_slot_data()

	}
	else{
		console.log("File not found")
	}
}
xhttp.send();
}

function view_slot_data(){
	for (s in slot_data) {
		id = slot_data[s].SID
		task = slot_data[s].task
		f_time = slot_data[s].from_time
		t_time = slot_data[s].to_time;
		set_slot(id, task, f_time, t_time)
	}
}

function set_slot(id, task, f_time, t_time) {
	d = convertDate(f_time)
	time_id = d.slice(0, 2)
	t = convertDate(t_time)
	var batch = document.createElement("div");
	if(View = "day"){
			batch.classList.add('slot-wrapper')
			batch.setAttribute('id', id)
			s_slot = document.getElementById(time_id)
			batch.innerHTML = "Lecture of "+task+" at "+d+" till "+t;
			s_slot.appendChild(batch);
		}
		else{
			console.log("False")
		}
	}
	if(View == "week"){
		batch.classList.add('slot-col')
		batch.setAttribute('id', id)
		batch.innerHTML = "Lecture of "+task+" at "+d+" till "+t;
		document.querySelector("#day_id").appendChild(batch);
	}
function error(message){
	document.querySelector(".error").innerHTML = message
}

function openModal() {
	document.querySelector('.error').innerHTML = ''
    addslot.style.display = "flex"
}

function closeModal() {
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