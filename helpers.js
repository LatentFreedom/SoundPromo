// Name:    helpers.js
// Author:  Nick Pal. 
// Description: Functions that run on popup.html and use the google extension api

function dismissCaution() {
    "use strict";
    var cautionBox = document.getElementById("caution"),
        dismissButton = document.getElementById("dismissButton");
    cautionBox.setAttribute("style", "display:none");
    dismissButton.setAttribute("style", "display:none");
}

function displayHelp() {
    "use strict";
    var helper = document.getElementsByClassName("help")[0], i;
    if (helper.style.display === "none") {
        document.getElementById("helpButton").style.backgroundColor = "green";
        helper.style.display = "block";
    } else {
        document.getElementById("helpButton").style.backgroundColor = "crimson";
        helper.style.display = "none";
    }
}

function loadInputs() {
    "use strict";
    // Load Info //
    chrome.storage.local.get('repostAmount', function (result) {
        if (result.specificRepostAmount !== undefined) {
            document.getElementById("repostAmount").value = result.repostAmount;
        } else {
            document.getElementById("repostAmount").value = "";
        }
    });
}

function saveInputs() {
    "use strict";
    document.getElementById("saveButton").style.backgroundColor = "green";
    var specificRepostAmount = document.getElementById("repostAmount").value;
    // Save Info //
    chrome.storage.local.set({'repostAmount': repostAmount});
}

function addButtonListener() {
    "use strict";
    var submitButton = document.getElementById("submitButton"),
        dismissButton = document.getElementById("dismissButton"),
        helpButton = document.getElementById("helpButton"),
        saveButton = document.getElementById("saveButton");
    submitButton.addEventListener('click', function () {
        validatePromotion();
    });
    dismissButton.addEventListener('click', function () {
        dismissCaution();
    });
    helpButton.addEventListener('click', function () {
        displayHelp();
    });
    saveButton.addEventListener('click', function () {
        saveInputs();
    });
    
}

document.addEventListener('DOMContentLoaded', function () {
    "use strict";
    addButtonListener();
    loadInputs();
});