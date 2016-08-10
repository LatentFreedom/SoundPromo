// Name:    forms.js
// Author:  Nick Pal. 
// Description: Functions that run on popup.html

function getInput() {
    "use strict";
    var repostAmount = document.getElementById("repostAmount").value;
    if (repostAmount === "") {
        console.warn("Invalid amount.");
        return "invalid";
    }
    return repostAmount;
}

function beginPromotion(repostAmount) {
    "use strict";
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
        console.log("connecting");
        var port = chrome.tabs.connect(tabs[0].id, {name: "soundpromo"});
        port.postMessage({promo: repostAmount});
    });
}

function validatePromotion() {
    "use strict";
    var repostAmount = getInput();
    if (repostAmount !== "invalid") {
        console.log("Valid inputs.");
        beginPromotion(repostAmount);
    }
}