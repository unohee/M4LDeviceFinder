autowatch = 1; // Automatically recompile when the script changes
outlets = 1; // Set the number of outlets


var parentId;
var deviceID = [];
var deviceName = [];
var parameters = [];
var loadState = 0;


function loadDevices() {
    // Function to get the canonical parent's path
    var thisDevice = new LiveAPI("this_device"); // Create a LiveAPI object for the path of 'this_device'
    parentId = thisDevice.get("canonical_parent"); // Get the ID of the canonical parent
    deviceObj = [];
    deviceName = [];
    deviceID = [];
    loadState = 0;
    post('Loading All Devices in rack....\n');
    if (parentId) {
        var canonicalParent = new LiveAPI(parentId); //LiveAPI would except 'id #' not the numnber only.
        var self = (thisDevice.id); //assign id from itself
        //If there is a valid ID, create a LiveAPI object for the parent
        var devices = canonicalParent.get('devices');
        if(devices.length != 0){
            for(i=0;i<devices.length;i++){
                if(devices[i]=='id'){
                    //filter 'id' from devices
                }else{
                    //only takes actual id in decimal pattern.
                    if(devices[i]!=self){
                        //also filter out current devices
                        deviceID.push(devices[i]);
                    }
                }
            }
            for (i=0;i<deviceID.length;i++){
                //since ids are separated elements in list, iterate devices per 2 indices (id,##)
                if(deviceID[i]!=self){
                    var device = new LiveAPI('id',deviceID[i]);
                    var name = device.get('name');
                    //populate the deviceObj with name and device id
                    deviceName.push(name);
                }
            }
            post('Finished\n');
            loadState = 1;
        }
    }
    
}

function getDeviceList() {
    loadDevices();
    // Get device list
    if(loadState==1){
        // Check if 'deviceName' is defined and is an array
        if (Array.isArray(deviceName)) {
            var list = deviceName.map(function(item) {
                // Convert each item to a string, if necessary
                return item.toString();
            });
            // Output the entire list as an array
            outlet(0, 'device',list);
        } else {
            // Handle the case where 'deviceName' is not an array or not defined
            post("Error: 'deviceName' is not an array or is undefined.\n");
        }
    }else{
        post("error\n");
    }
}

function getParameterValue(index){
    parameters = [];
    if(deviceID.length > 0){
        var device = new LiveAPI('id',deviceID[index]);
        var paramId = device.get('parameters')
        for (i=0;i<paramId.length;i+=2){
            var id = paramId[i+1];
            var p_id = new LiveAPI('id', id);
            var params = new LiveAPI('id', p_id[1]); //getting all parameters from the device
            var value = params.get('value');
            var name = params.get('name');
            var max = params.get('max');
            var min = params.get('min');
            parameters.push(name,value,max,min);
            parameters = parameters.map(function(item) {
                //change this code lines accordingly.
                // Convert each item to a string and prepend 'param'
                return item.toString();
            });
            
        }
        // Output the entire list as an array   
        outlet(0,'param', parameters);
    }else{
        post("Devices are not recognized")
    }
}

function bang(){
    getDeviceList();
    getParameterValue(0);
}

//initialization
getDeviceList();
getParameterValue(0);