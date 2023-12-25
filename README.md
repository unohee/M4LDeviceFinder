
# M4LDeviceFinder

## Overview
M4LDeviceFinder is a JavaScript utility for Max for Live (M4L), developed by Heewon Oh for educational and tutorial purposes. It is designed to enhance interaction with devices in an Ableton Live set, providing functionality to load, list, and retrieve parameters from these devices. This tool is particularly useful for those looking to deepen their understanding and control within the Max for Live environment.

## Features
- **Device Loading**: Dynamically load all devices from the Live set.
- **Device Listing**: Retrieve and list the names of all loaded devices.
- **Parameter Retrieval**: Access specific parameters, including names, values, max, and min settings of devices.

## Usage
To use `deviceFinder.js` and `DeviceFinder.amxd` in your Max for Live project:

1. **Add the Script and AMXD to Your Project**:
   - Download `deviceFinder.js` and `DeviceFinder.amxd`.
   - Include them in your Max for Live project.

2. **Create a [js] Object in Max**:
   - In your Max patch, create a new `[js]` object.
   - Load the `deviceFinder.js` script into this object.

3. **Interact with the Script**:
   - Send messages to the `[js]` object to interact with devices in Ableton Live.
   - Use functions like `loadDevices()`, `getDevList()`, and `getParameterValue(index)`.

## Functions
- `loadDevices()`: Load all devices from the Live set.
- `getDevList()`: List all loaded devices.
- `getParameterValue(index)`: Retrieve parameters for the device at the specified index.

## Requirements
- Ableton Live with Max for Live.
- Basic knowledge of Max/MSP programming.

## Troubleshooting
If encountering errors such as "bad outlet index", ensure the number of outlets defined at the start of the script matches the indices used in `outlet()` function calls. Outlets are zero-based.

## Takeaway
The M4LDeviceFinder script is a versatile tool intended for educational purposes, designed to simplify device management and parameter access in Max for Live. It offers an intuitive way to interact with the dynamic world of Ableton Live, enhancing both learning and creative workflows.

## License
This project is licensed under the GNU General Public License version 3.0.

## Author
Heewon Oh
