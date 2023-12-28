document.addEventListener('DOMContentLoaded', function() {
    chrome.runtime.sendMessage({action: "queryState"}, function(response) {
        updateButtonState(response.isSwitching);
    });
});

function updateButtonState(isRunning) {
    let button = document.getElementById("toggleButton");
    let statusText = document.getElementById("statusText");

    if (isRunning) {
        button.classList.replace("start", "stop");
        button.textContent = "Stop";
        statusText.textContent = "Status: Running";
    } else {
        button.classList.replace("stop", "start");
        button.textContent = "Start";
        statusText.textContent = "Status: Not Running";
    }
}

document.getElementById("toggleButton").addEventListener("click", function() {
    let button = document.getElementById("toggleButton"); 
    let isRunning = button.textContent === "Start";
    let intervalInput = document.getElementById("interval").value;
    let interval = intervalInput ? parseInt(intervalInput) * 1000 : null;
    updateButtonState(isRunning);

    chrome.runtime.sendMessage({action: "toggleSwitching", value: isRunning ? interval : null});
});
