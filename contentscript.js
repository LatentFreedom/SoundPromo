// Name:    contentscript.js
// Author:  Nick Pal. 
// Description: Functionality that runs on the pages given in manifest

// return the number of tracks on user page
function getTracks() {
    "use strict";
    //window.scrollTo(0, document.body.scrollHeight);
    var trackCount = document.getElementsByClassName("infoStats__stat")[2].getElementsByTagName("div")[0].innerHTML,
        trackList = document.getElementsByClassName("soundList__item");
    if (trackList.length < trackCount) {
        //window.scrollTo(0, document.body.scrollHeight);
        trackList = document.getElementsByClassName("soundList__item");
        console.log("Total tracks found: " + trackList.length);
    }
    return trackList;
}

// open 'Add to a group' popup
function openGroupAdd(track) {
    "use strict";
    var trackButtons = track.getElementsByTagName("button"),
        addToGroupButton = trackButtons[3];
    addToGroupButton.click();
}

// 
function isAdded(addButton) {
    "use strict";
    var innerText = addButton.innerHTML;
    if (innerText === "Added") {
        return true;
    }
    return false;
}

// add every track on user page to all followed groups
function promoteTrack(repostAmount) {
    "use strict";
    var section = document.getElementsByClassName("modal__content")[0],
        groupAddButtons = section.getElementsByTagName("button"),
        i,
        notDone = true;
    if (repostAmount > groupAddButtons.length) {
        repostAmount = groupAddButtons.length;
        console.warn("Not enough followed groups given input. Reposting to followed groups.");
    }
    for (i = 0; i < repostAmount; i++) {
        if (isAdded(groupAddButtons[i])) {
            while(notDone) {
                groupAddButtons[i].click(); // remove
                groupAddButtons[i].click(); // add
                notDone = false;
            }
        } else {
            groupAddButtons[i].click(); // add
        }
        notDone = true;
    }
}

function findGivenTrack(trackName, trackList) {
    "use strict";
    var i;
    for (i = 0; i < trackList.length; i++) {
        var title = trackList[i].getElementsByTagName("a")[2].getElementsByTagName("span")[0].innerHTML;
        if (title.indexOf(trackName) > -1) {
            console.log("Found: " + title);
            return trackList[i];
        }
    }
    console.warn("Could not find track: " + trackName);
    return false;
}

// post specified track to repostAmount followed groups
function promoteSpecificTrack(trackName, repostAmount) {
    "use strict";
    var trackList = getTracks(),
        track = findGivenTrack(trackName, trackList);
    if (track !== false) {
        openGroupAdd(track);
        promoteTrack(repostAmount);
    }
    
}

// close the group add popup window
function closeGroupAdd() {
    "use strict";
    var closeButton = document.getElementsByClassName("modal__closeButton")[0];
    closeButton.click();
}

// post most recent tracks to repostAmount followed groups
function promoteMostRecentTracks(recentAmount, repostAmount) {
    "use strict";
    var trackList = getTracks(),
        i;
    for (i = 0; i < recentAmount; i++) {
        openGroupAdd(trackList[i]);
        promoteTrack(repostAmount);
        closeGroupAdd();
    }
}

var trackList = getTracks();

chrome.runtime.onConnect.addListener(function (port) {
    "use strict";
    console.assert(port.name === "soundpromo");
    port.onMessage.addListener(function (msg) {
        if (msg.promo) {
            console.log("Message heard.");
            console.log(msg.promo);
            var repostAmount = msg.promo;
            console.log("Resposting to " + toString(msg.promo) + " groups.");
            promoteTrack(repostAmount);
        }
    });
});


