// Components.utils.import("resource://gre/modules/Console.jsm");
// <a href="https://www.flaticon.com/free-icons/detail" title="detail icons">Detail icons created by Uniconlabs - Flaticon</a>
// https://www.flaticon.com/search?word=people%20list&order_by=4&type=icon
let portFromRosterizer;
// listen for message from rosterizer.
browser.runtime.onConnect.addListener(connectToRosterizer);

function connectToRosterizer(prt) {
    // set up connection
    portFromRosterizer = prt;

    // set up listener for messages. 
    portFromRosterizer.onMessage.addListener(function (message) {
        // handle message
        //portFromRosterizer.postMessage({text:"got Message"});

        //portFromRosterizer.postMessage({text:"sent back"});
        if (typeof message !== "undefined") {
            //portFromRosterizer.postMessage({text:"message Defined"});
            // has message
            if (typeof message.showRoster !== "undefined") {
                //portFromRosterizer.postMessage({text:"showRoster Defined as " + message.showRoster});
                // add or remove roster CSS
                toggleCSS(message.showRoster);
            }
        }

    });
}


// toggleCSS(true);
// toggleCSS(false);

// Add context menu item.
const rosterID = "roster-maker-tab";
browser.menus.create({
    id: rosterID,
    title: "Make a roster",
    contexts: ["all"],
    checked: false
});

browser.menus.onClicked.addListener((info, tab) => {
    if (info.menuItemId == rosterID) {
        browser.tabs.insertCSS(tab.ID, { file: "roster-changes.css" });
    }
});


// not needed, this is handled in the manifest.
// // add browser button
// var allTabs = browser.tabs.query({});
// allTabs.then(function(tabList){
//     for(var tb of tabList){
//         //browser.pageAction.setIcon({tabId: tb.id, path:"icons/tasks-24.png"});
//         // browser.pageAction.setTitle({tabId: tb.id, title: "Show Roster"});
//         // browser.pageAction.show(tb.id);
//     }
// });

function pageActionClicked(tab){
    var currentTitleResp = browser.pageAction.getTitle({tabId:tab.id});
    currentTitleResp.then((txt) => {
        portFromRosterizer.postMessage({action:{ highquality : true}});
        toggleCSS(true);
    });
}

browser.pageAction.onClicked.addListener(pageActionClicked);


function toggleCSS(show) {
    var tabs = browser.tabs.query({ currentWindow: true });
    tabs.then(function (tabList) {
        // portFromRosterizer.postMessage({ text: "tabs : " + tabList.length });
        var tab;
        // cannot get tab by index (0) .. so using loop. Boy this is ugly.
        for (var tb of tabList) {
            tab = tb;
        }
        // portFromRosterizer.postMessage({ text: "tab : " + tab.id });
        // portFromRosterizer.postMessage({ text: "tab : " + tab.url });
        // portFromRosterizer.postMessage({ text: "tab : " + tab.title });
        // portFromRosterizer.postMessage({ text: "tab : " + tab.active });

        var changeCss;

        if (show) {
            changeCss = browser.tabs.insertCSS(tab.id, { file: "roster-changes.css" });
        } else {
            changeCss = browser.tabs.removeCSS(tab.id, { file: "roster-changes.css" });
        }
        changeCss.then(
            null, function (whyBad) { // only report if there is an error.
                portFromRosterizer.postMessage({ text: whyBad + "" });
            });
    }, function () {
        // error
        portFromRosterizer.postMessage({ text: "Oopsy" });

    });
}




//browser.runtime.onMessage.addListener(notiHandle);

// function notiHandle(message){
//     // message should be :    {"showRoster": true | false}
//     if (typeof message !== "undefined"){
//         // has message
//         if (typeof message.showRoster !== "undefined"){
//             // add or remove roster CSS

//         }
//     }
// }


// browser.browserAction.onClicked.addListener(() => {
//     function onError(error) {
//         console.log(`Error: ${error}`);
//     }

//     var tabList = browser.tabs.query({});
//     var tabID = tabList[0].id;
//     console.log(tabID);

//     var insertingCSS = browser.tabs.insertCSS(tabID, { file: "temp.css" });
//     insertingCSS.then(null, onError);
// });