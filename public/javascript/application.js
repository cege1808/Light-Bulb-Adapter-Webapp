$(document).ready(function(){
	



//Get you accesstoken from LocalStorage if you've logged in before.
	var access_token = localStorage.getItem("access_token");
	
	//Delete accesstoken from LocalStorage, and reload page.
	function logOut() {
	    localStorage.removeItem("access_token");
	    window.location.reload();
	}
	
	//replace Log-in button with Log-out button.
	function showLogout(){
		document.getElementById('log-out').style.display = 'flex';
		document.getElementById('spark-login').style.display = 'none';
	}
	
	//The login button logic from the library. Saves accestoken to LocalStorage.
	sparkLogin(function(data){	
		document.getElementById('spark-login-button').style.backgroundColor="#00E31A";
		document.getElementById('spark-login-button').innerHTML = 'Logging in, please wait.';
		console.log(data);		
		access_token = data.access_token;
        localStorage.setItem("access_token", access_token);
        LoggedIn(data);
	});
	
	//If an accesstoken is still present from a login, then log in automatically.
	if (access_token){
		console.log(access_token);
		console.log(document.getElementById('spark-login-button'));
		document.getElementById('spark-login-button').style.backgroundColor="#00E31A";
		document.getElementById('spark-login-button').innerHTML = 'Logging in, please wait.';
		spark.login({accessToken: access_token }, LoggedIn);
	}

	//------- Post log in functionality ---------
	
	// Sets brightness value on device
	// Remember to rest value on table after calling this to keep table live.
	function execute(deviceId, func) {
		argument = document.getElementById(func + 'input'); 
		spark.callFunction(deviceId,func,argument.value,null);
		argument.value = "";
	};
	
	// Gets brightness value and insert into table.
	function update(deviceId, variable) {
		spark.getVariable(deviceId,variable,function(err, data){
			console.log(data);
			variableValue = document.getElementById(variable + deviceId);
			variableValue.value = data.result;
			$("#bulblevel").html(data.result);
		});

	};
	
	function LoggedIn(data){
		var devicesAt = spark.getAttributesForAll();
		console.log(access_token);
		
		devicesAt.then(
			function(data){
				console.log('Core attrs retrieved successfully:', data);
				for (var i = 0; i < data.length; i++) {
					console.log('Device name: ' + data[i].name);
					console.log('- connected?: ' + data[i].connected);

					// Display dimming variable and field to set dimming in table.
					// Loops through returned data array to find needed info.
					console.log('- functions: ' + data[i].functions);
					if (data[i].functions != null && data[i].variables != null) {	
						for (func in data[i].functions) {
							if (data[i].functions[func] == "setDimming") {
								console.log('has setDimming Function');
								console.log('has dimming variable');
								
								if (data[i].variables != null) {
									for (variable in data[i].variables) {
										if (variable == "dimming") {
											var type = data[i].variables[variable];
											console.log("variable: " + variable + " type: " + type);
										}
									}
								}
								
								functionName = data[i].functions[func]
								var deviceName = data[i].name;
								var lightName = deviceName.replace(/_/g, " ");
								
								$("#label1").append(lightName);
								


								// Intsert HTML at lights table body to create row for light
								$('#lights tbody').append(
									'<tr><td><strong>' + lightName + '</strong></td>' +
								'<td>' + '<input type="text" class="form-control" placeholder="Click Get!" readonly id="' + variable + data[i].id + '">' + '</td>' +

								'<td><div class="input-group input-group-sm">' + 
							        '<input type="text" class="form-control" placeholder="Enter Brightness" id="' + functionName + 'input">'+
							        '<span class="input-group-btn">' +
							        	'<button class="btn btn-default" type="button" onclick="execute(\'' + data[i].id + '\', \'' + functionName + '\'); update(\'' + data[i].id + '\', \'' + variable + '\');">go!</button>'+
							        '</span>'+
							    '</div></td>' +
								'</tr>'
								);
								update(data[i].id, variable);
								
							}		
											
						}
					}
					
					$('#lights').hide();
					showLogout();

					console.log("\n");
				}
			},
			function(err) {
				console.log('API call failed: ', err);
			}
		);	
	};




  $(function() {

    $( "#sortable .row" ).sortable();
    $( "#sortable .row" ).disableSelection();
    $( "#slider1" ).slider({
    	change:function(event,ui){
    		$("#dimlevel").html(ui.value);
    	}
    });
   

    $( "#collapse1" ).hide();
   	$( "#toggle1" ).click(function() {
  		$( "#collapse1" ).toggle();
	});
    
   	$( "#slider2" ).slider({
    });

    $( "#collapse2" ).hide();
   	$( "#toggle2" ).click(function() {
  		$( "#collapse2" ).toggle();
	});

   	$("#strobe1 .button_on").hide();
   	$("#strobe1").on('click', function(){
 		$("#strobe1 .button_off").toggle();
 		$("#strobe1 .button_on").toggle();
   	});

   	$("#strobe2 .button_on").hide();
   	$("#strobe2").on('click', function(){
 		$("#strobe2 .button_off").toggle();
 		$("#strobe2 .button_on").toggle();
   	});

   	$("#count").hide();

 	$(".countdown").hide();
 	$("#timer_set").on('click', function(){
 		$("#settimer .dropdown-select").hide();
	  	$(".countdown").show();
   	});
   	$("#timer_reset").on('click', function(){
 		$("#settimer .dropdown-select").show();
	  	$(".countdown").hide();
   	});
   	

   	$(".showtime").hide();
   	$("#alarm_set").on('click', function(){
 		$("#setalarm .dropdown-select").hide();
	  	$(".showtime").show();
	  	document.getElementById("alarm_displayhours").innerHTML= document.getElementById("alarm_hours").value;
		document.getElementById("alarm_displayminutes").innerHTML= document.getElementById("alarm_minutes").value;
		document.getElementById("alarm_displayampm").innerHTML= document.getElementById("alarm_ampm").value.toString();
   	});
   	$("#alarm_reset").on('click', function(){
 		$("#setalarm .dropdown-select").show();
	  	$(".showtime").hide();
   	});
  });


  
	$('#timer_set').on('click',
	function(){
	  	var start_num_hour= document.getElementById("timer_hours").value;
	  	var start_num_min= document.getElementById("timer_minutes").value;
	  	var start_num_sec= document.getElementById("timer_seconds").value;
	  	var unit_var_hour="3600";
	  	var unit_var_min="60";
	  	var unit_var_sec="1";
	  	var start_num;
	  
	  	start_num= (start_num_sec*parseInt(unit_var_sec))+(start_num_min*parseInt(unit_var_min))+(start_num_hour*parseInt(unit_var_hour));
	  	
	  	var countdown_output=document.getElementById("count");
	  	

	  	if (start_num>0){
  		countdown_output.innerHTML = format_as_time(start_num);
		var t=setTimeout("update_clock(\"count\", "+start_num+")", 1000);
	  	}


	  	return false;
	  });



	function update_clock(countdown_div, new_value) {
		 var countdown_output = document.getElementById("count");
		 var new_value = new_value - 1;

		 if (new_value > 0) {
		 new_formatted_value = format_as_time(new_value);
		 countdown_output.innerHTML = new_formatted_value;

		 var t=setTimeout("update_clock(\"count\", "+new_value+")", 1000);
		 } 

		 else {
		 countdown_output.innerHTML = "And... Stop!";
		 document.getElementById("timer_displayhours").innerHTML="00";
		 document.getElementById("timer_displayminutes").innerHTML="00";
		 document.getElementById("timer_displayseconds").innerHTML="00";
		 $("#settimer .dropdown-select").delay(5000).show();
	  	 $(".countdown").delay(5000).hide();
		 clearTimeout(t);
		}

		$('#timer_stop').on('click', function(){
	  		clearTimeout(t);
	  	});

	  	$('#timer_reset').on('click', function(){
	  		clearTimeout(t);
	  		document.getElementById("count").innerHTML = "And... Stop!";
			document.getElementById("timer_displayhours").innerHTML="00";
			document.getElementById("timer_displayminutes").innerHTML="00";
			document.getElementById("timer_displayseconds").innerHTML="00";
	  	});
	}

 	function format_as_time(seconds) {
 		 var hour= parseInt(seconds/3600);
 		 var minutes = parseInt((seconds - (hour*3600)) /60);
		 var seconds = parseInt(seconds - (minutes*60) - (hour*3600)) ;

		 if (hour < 10) {
		 hour = "0"+hour;
		 }

		 if (minutes < 10) {
		 minutes = "0"+minutes;
		 }

		 if (seconds < 10) {
		 seconds = "0"+seconds;
		 }

		 // var return_var = hour+':'+minutes+':'+seconds;
		document.getElementById("timer_displayhours").innerHTML=hour.toString();
		document.getElementById("timer_displayminutes").innerHTML=minutes.toString();
		document.getElementById("timer_displayseconds").innerHTML=seconds.toString();
		 // return return_var;
	}

})




