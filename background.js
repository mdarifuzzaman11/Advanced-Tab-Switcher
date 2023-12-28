let tabSwitcherInterval;
let isSwitching = false;
let switchInterval = 45000; // Default to 45 seconds

chrome.storage.sync.get(['switchInterval'], function(result) {
    switchInterval = result.switchInterval || switchInterval;
});

function updateBadge() {
    let text = isSwitching ? "On" : "Off";
    let color = isSwitching ? "#00FF00" : "#FF0000";
    chrome.action.setBadgeText({ text: text });
    chrome.action.setBadgeBackgroundColor({ color: color });
}

function switchTabs() {
    chrome.tabs.query({ currentWindow: true }, function (tabs) {
        if (tabs.length <= 1) return;

        let activeTabIndex = tabs.findIndex(tab => tab.active);
        let nextTabIndex = (activeTabIndex + 1) % tabs.length;
        chrome.tabs.update(tabs[nextTabIndex].id, { active: true });
    });
}

function startSwitching() {
    if (isSwitching) return;
    isSwitching = true;
    updateBadge();
    switchTabs(); // Immediately switch once when starting.
    tabSwitcherInterval = setInterval(switchTabs, switchInterval);
}

function stopSwitching() {
    if (!isSwitching) return;
    clearInterval(tabSwitcherInterval);
    isSwitching = false;
    updateBadge();
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "toggleSwitching") {
        if (isSwitching) {
            stopSwitching();
        } else {
            if (request.value) {
                switchInterval = parseInt(request.value);
                chrome.storage.sync.set({ 'switchInterval': switchInterval });
            }
            startSwitching();
        }
        sendResponse({isSwitching: isSwitching});
    } else if (request.action === "queryState") {
        sendResponse({isSwitching: isSwitching});
    }
});

chrome.commands.onCommand.addListener(function(command) {
    if (command === "toggle-switch") {
        if (isSwitching) {
            stopSwitching();
        } else {
            startSwitching();
        }
    }
});

updateBadge();
