autowatch = 1; // Automatically recompile when the script changes
outlets = 2; // Set the number of outlets


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

function extractID(list){
    var id = []; 
    for (i=0;i<list.length;i++){
        if(list[i]=='id'){
            //filter 'id' from devices
        }else{
            //only takes actual id in decimal pattern.
            id.push(list[i]);
        }
    }
    return id;
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

function getParamList(index){
    parameters = [];
    if(deviceID.length > 0){
        var device = new LiveAPI('id',deviceID[index]);
        var paramId = device.get('parameters')
        extractID(paramId);
        for (i=0;i<paramId.length;i+=2){
            var id = paramId[i+1];
            var p_id = new LiveAPI('id', id);
            var params = new LiveAPI('id', p_id[1]); //getting all parameters from the device
            var name = params.get('name');
            parameters.push(name);
            parameters = parameters.map(function(item) {
                return item.toString();
            });
        }
        // Output the entire list as an array   
        outlet(0,'param', parameters);
    }else{
        post("Devices are not recognized")
    }
}

function loadDict(name) {
    // Find the device by its name
    var d = new Dict('preset');
    for (var i = 0; i < deviceID.length; i++) {
        if (deviceName[i] == name) {
            var name_this = name;
            var device = new LiveAPI("id " + deviceID[i]);
            var n = device.getcount('parameters');
            var p_id = extractID(device.get('parameters'));
            post('Parameter count::'+n+'\n');
            outlet(0, 'paramcount',n );
            d.clear(); //clear the dict before populate
            for(i=0;i<p_id.length;i++){
                var param = new LiveAPI('id', p_id[i]);
                var title = name_this+'::'+param.get('name')+'::';
                d.replace(title+'id', p_id[i]);
                d.replace(title+'value', param.get('value'));
                d.replace(title+'maximum', param.get('max'));
                d.replace(title+'minimum', param.get('min'));
            }
            outlet(1, 'bang'); //send bang when all list population is completed
            break;
        }
    }
}

function bang(){
    getDeviceList();
    getParamList(0);
}

//initialization
getDeviceList();
getParamList(0);