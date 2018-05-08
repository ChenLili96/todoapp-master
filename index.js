Backendless.initApp("0B5B881C-AB5A-D7C5-FF52-297088A1FC00","9507AC93-13CF-F45F-FFA2-0DEF6F8E8F00");

$(document).on("pagecreate","#map-page", function() {
    
    var defaultLatLng = new google.maps.LatLng(52.19506868295893, -2.2171345539368303);  // Default to Hollywood, CA when no geolocation support
    if ( navigator.geolocation ) {
        function success(pos) {
            // Location found, show map with these coordinates
            drawMap(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        }
        function fail(error) {
            drawMap(defaultLatLng);  // Failed to find location, show default map
        }
        // Find the users current position.  Cache the location for 5 minutes, timeout after 6 seconds
        navigator.geolocation.getCurrentPosition(success, fail, {maximumAge: 500000, enableHighAccuracy:true, timeout: 6000});
    } else {
        drawMap(defaultLatLng);  // No geolocation support, show default map
    }
    
    
    function drawMap(latlng) {
        var myOptions = {
            zoom: 15,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        
        var map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
        
        // Add an overlay to the map of current lat/lng
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: "Greetings!"
        }); 
        google.maps.event.addListener(map, 'click', function(event) {
              
          console.log("clicked " + event.latLng);
              
          var marker = new google.maps.Marker({
            
            position: event.latLng,
            map: map,
            title: "Hello"
        });
              
        var newPosition = {};
        newPosition = event.latLng;
        var pos= JSON.stringify(newPosition);
        Backendless.Data.of("Position").save(newPosition).then(append).catch(error);                  
   
          });  
        
    }


    function append(Position){
        
        console.log(Position);
         //add each poition
        for (var x = 0; x < Position.length; x++) { 
        
            console.log(Position[x].objectId);
        
            var marker = new google.maps.Marker({
            
            position: {lat: Position[x].lat, lng: Position[x].lng},
            map: map,
            title: "Hello"
        });  
        
    }    

    }
        
    
    
});

$(document).on("pageshow","#loginpage", onPageShow1);
function onPageShow1() {
	console.log("page shown1");
    $(document).on("click", "#userloginbutton", userlogin);
} 


$(document).on("pageshow","#registerpage", onPageShow2);
function onPageShow2() {
	console.log("page shown2");
    $(document).on("click", "#registerbutton", register);
} 


function userlogin(user){
    
    console.log("login clicked");
    var username=$('#login').val();
    var password=$('#password').val();
    if (username == '') {
        alert("Please enter your email address");
        
    }
    if (password == '') {
        alert("Please enter your password");
        
    }
    
    Backendless.UserService.login(username, password, true).then(function(userLoggedInStatus){
        
    console.log("user has loged in");
    window.location.href="#todopage";
        
    }).catch(function(error){
        
     console.log("loged failed");
     alert("error message");  
        
    });
                                                                
}

function register(){
    var user = new Backendless.User();
    user.email=$('#email').val();
    user.password=$('#pass').val();
    Backendless.UserService.register(user).then(userRegistered).catch(gotErrorRegister);
      
}
function userRegistered(user){
    //console.log("registered success");
    alert("Registered success. Now let's log in.");
    window.location.href="#loginpage";
}
function gotErrorRegister(err){
    alert("error message:" +err.message); 
    
}



$(document).on("pageshow","#todopage", onPageShow);
function onPageShow() {
	console.log("page shown");
    
	$("#taskList").empty();
	
	//run a query
	Backendless.Data.of( "Tasks" ).find().then( processResults).catch(error);
    
    $(document).on("click", "#addTaskButton", onAddTask);

} 

function onAddTask() {
		console.log("add task button clicked");
        var tasktext = $("#addTaskText").val();
        
        var newTask = {};
        newTask.Task = tasktext;
        Backendless.Data.of("Tasks").save(newTask).then(saved).catch(error);    
        location.reload();
        document.getElementById("addTaskText").value="";
}

function saved(savedTask) { 
      console.log( "new Contact instance has been saved" + savedTask);

   
}


function  processResults(tasks) {
    //alert(tasks[1].Task)
     console.log("Tasks");
    //add each tasks
    for (var i = 0; i < tasks.length; i++) { 
        $("#taskList").append("<li><a href id="+ tasks[i].objectId +">"+tasks[i].Task+ "</a><a href='#' id="+ tasks[i].objectId +" class='delete'>delete</a> </li>");
    }
    
    //refresh the listview
    $("#taskList").listview('refresh');
    
    
    $(".delete").on('click', function(){
       
        var objectId = $(this).attr("id")
        alert("click" + objectId);
        
        //delete objectId
       
        Backendless.Data.of( "Tasks" ).remove( objectId )
        .then( function( timestamp ) {
        console.log( "Contact instance has been deleted" );
        location.reload();
        })
        .catch( function( error ) {
        console.log( "an error has occurred " + error.message );
        });
        
       
    });

}

function error(err) {
    alert(err);
}

























