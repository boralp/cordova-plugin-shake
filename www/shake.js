
module.exports = (function () {
    "use strict";
    var shake = {};

    var watchId = null;

    var options = {
        frequency: 300
    };
    var previousAcceleration = {
        x: null,
        y: null,
        z: null
    };

    var shakeCallBack = null;
    var sensitivity = 30;
    var sensitivity_max = 50;
    
    // Start watching the accelerometer for a shake gesture
    shake.startWatch = function (onShake, _sensitivity, _sensitivity_max, onError) {
        if (typeof (onShake) !== "function") {
            return;
        }

        if (typeof (_sensitivity) === "number") {
            sensitivity = _sensitivity;
        }
        
        if (typeof (_sensitivity_max) === "number") {
            sensitivity_max = _sensitivity_max;
        }

        shakeCallBack = debounce(onShake);

        watchId = navigator.accelerometer.watchAcceleration(assessCurrentAcceleration, onError, options);
    };

    // Stop watching the accelerometer for a shake gesture
    shake.stopWatch = function () {
        if (watchId !== null) {
            navigator.accelerometer.clearWatch(watchId);
            watchId = null;

            previousAcceleration = {
                x: null,
                y: null,
                z: null
            };
        }
    };

    // Assess the current acceleration parameters to determine a shake
    var assessCurrentAcceleration = function (acceleration) {
        var accelerationChange = {};
        if (previousAcceleration.x !== null) {
            accelerationChange.x = Math.abs(previousAcceleration.x - acceleration.x);
            accelerationChange.y = Math.abs(previousAcceleration.y - acceleration.y);
            accelerationChange.z = Math.abs(previousAcceleration.z - acceleration.z);
        }

        previousAcceleration = {
            x: acceleration.x,
            y: acceleration.y,
            z: acceleration.z
        };
        if ((accelerationChange.x + accelerationChange.y + accelerationChange.z > sensitivity) && (accelerationChange.x + accelerationChange.y + accelerationChange.z < sensitivity_max)) {
            // Shake detected
            if (document.getElementById('counter')) {
                document.getElementById('counter').innerHTML += (accelerationChange.x + accelerationChange.y + accelerationChange.z) + '<br>';
            }
            shakeCallBack();
        }
    };

    // Prevent duplicate shakes within 750ms
    var debounce = function (onShake) {
        var timeout;
        return function () {
            if (timeout) {
                return;
            }

            timeout = setTimeout(function () {
                clearTimeout(timeout);
                timeout = null;
            }, 750);

            onShake();
        };
    };

    return shake;
})();
