/*
 * JavaScript file
 */

function init() {
	
	// GM SDK Location
	
	var gmLatitude = 0;
	var gmLongitude = 0;
	
	gm.info.getCurrentPosition(
    function(positionObj) {
        console.log('Success: getCurrentPosition.');
        
        gmLatitude = positionObj.coords.latitude / 3600000;
        gmLongitude = positionObj.coords.longitude / 3600000; 
        
        console.log('Timestamp: ' + positionObj.timestamp + ', Latitude: ' + gmLatitude + ', Longitude: ' + gmLongitude);
    },
    function() {
        console.log('Failure: getCurrentPosition. May need to load route in emulator.');
    },
    {
        maximumAge: 30000,
        timeout: 30000,
        frequency: 60000
    }
	);
	
	// Bing Maps
	
	var gasMap = null;
	var chargeMap = null;
  		
	var masterZoom = 13;
	var masterZoomCharge = 8;
	var zoomForSmallIcons = 10;
	
	function getGASMap(){
		gasMap = new Microsoft.Maps.Map(document.getElementById('gasMap'), {
			credentials: 'Ahc_9ZAeFXfptWdXNrnuH9A07McAzCnQZPl9y9eakkQw1CuR4vefY-sY1vvbj2EQ',
			enableSearchLogo: false, 
			showDashboard: true,  
			center: new Microsoft.Maps.Location(gmLatitude, gmLongitude), 
			zoom: masterZoom, 
			mapTypeId : Microsoft.Maps.MapTypeId.road
			});
	}
	
	function getChargeMap(){
		chargeMap = new Microsoft.Maps.Map(document.getElementById('chargeMap'), {
			credentials: 'Ahc_9ZAeFXfptWdXNrnuH9A07McAzCnQZPl9y9eakkQw1CuR4vefY-sY1vvbj2EQ',
			enableSearchLogo: false, 
			showDashboard: true,  
			center: new Microsoft.Maps.Location(gmLatitude, gmLongitude), 
			zoom: masterZoomCharge, 
			mapTypeId : Microsoft.Maps.MapTypeId.road
			});
	}
	
    function addUsrLocationPunchPin(map){
      	var pushpinOptions = null;
      	if(map.getZoom() >= zoomForSmallIcons ){
      		pushpinOptions = {icon: 'chevy_volt_32.png', width: 55, height: 32};
    	}else{
    		pushpinOptions = {icon: 'chevy_volt_64.png', width: 109, height: 64};
    	}
      	var pushpin= new Microsoft.Maps.Pushpin(map.getCenter(), pushpinOptions);
    	map.entities.push(pushpin);
	}
    
    function addStationPushPin(map, type, lat, lon, name){
    	
      	var pushpinOptions = null;
      	
      	if(type == 0){ 
      		// GAS STATION PINS
          	if(map.getZoom() >= zoomForSmallIcons ){
          		pushpinOptions = {icon: 'gas_pin_32.png', width: 32, height: 32};
        	}else{ 
        		pushpinOptions = {icon: 'gas_pin_64.png', width: 64, height: 64};
        	}
      		
      	}else{
      		//CHARGING STATION PINS
          	if(map.getZoom() >= zoomForSmallIcons ){
          		pushpinOptions = {icon: 'electric_pin_32.png', width: 32, height: 32};
        	}else{
        		pushpinOptions = {icon: 'electric_pin_64.png', width: 64, height: 64};
        	}
      		
      	}
      	
      	var pushpin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(lat, lon), pushpinOptions);
      	
    	map.entities.push(pushpin);
    	
    	console.log('Pushpin for station: ' + name + ' added to Map.');
	}
    
    //Setting up initial Maps with current car location
    
    getGASMap();
    
    addUsrLocationPunchPin(gasMap);
    
    getChargeMap();
    
    addUsrLocationPunchPin(chargeMap);

    
    //Invoking my back-end with latitude and longitude given by GM SDK
    
    var url = 'http://geofencingdemo.appspot.com/json/venues.jsp?lat=' + gmLatitude + '&lon=' + gmLongitude + '&r=10000&systemPassword=geoTest2011';
    console.log(url);
    
    $.getJSON(url, function(data) {
        //Processing data from my Backend
    	console.log(data);
    	//Each venue in the result array
    	$.each(data.result, function (index, value) {
            console.log(value);
            
        	addStationPushPin(gasMap, 0, value.latitude, value.longitude, value.name);
            
            //Each Value in a venue
            $.each(value, function (index, placeData) {
            	console.log(placeData);
            });
            
            
        });
    	
    });
    
    //Charging Stations are mannually added for now
    
    addStationPushPin(chargeMap, 1, 36.01, -111.195 , "Charge Station 1");
    addStationPushPin(chargeMap, 1, 36.07, -115.194 , "Charge Station 2");
    addStationPushPin(chargeMap, 1, 36.09, -113.197 , "Charge Station 3");
    addStationPushPin(chargeMap, 1, 36.15, -115.198 , "Charge Station 4");
    addStationPushPin(chargeMap, 1, 36.7, -115.204 , "Charge Station 5");
    addStationPushPin(chargeMap, 1, 36.8, -113.204 , "Charge Station 6");
    addStationPushPin(chargeMap, 1, 35.1, -115.205 , "Charge Station 7");
    addStationPushPin(chargeMap, 1, 36.7, -114.204 , "Charge Station 8");
    addStationPushPin(chargeMap, 1, 30.8, -115.204 , "Charge Station 9");
    addStationPushPin(chargeMap, 1, 36.1, -112.205 , "Charge Station 10");
    
}