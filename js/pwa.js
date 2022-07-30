"use strict";
var deferredPrompt;

if (!window.Promise) {
    window.Promise = Promise;
}

let swRegistration = null;

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/serviceworker.js') // register the service worker
        .then(function(swReg) {
            //console.log('Service worker registered!');
            swRegistration = swReg;
        })
        .catch(function(err) {
            console.log(err);
        });
} else {
    alert('Service workers are not supported in this browser.');
    //console.log("Push services is not supported.");
    //pushButton.style.display = "none";
}

window.addEventListener('beforeinstallprompt', function(event) {
    //console.log('beforeinstallprompt fired');
    event.preventDefault();
    deferredPrompt = event;
    return false;
});