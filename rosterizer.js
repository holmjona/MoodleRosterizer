// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Examples

const rosterButtonID = "roster-toggle-button";
// create message port for CSS calls
let myPort = browser.runtime.connect({ name: "roster-css-port" });
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts#communicating_with_background_scripts

// listen for message from background script
myPort.onMessage.addListener(function (mess) {
  if (typeof mess !== "undefined"){
    if (typeof mess.action != "undefined"){
      if (typeof mess.action.highquality != "undefined"){
        //clickShowAll(mess.action.highquality);
        changeImageSize(mess.action.highquality);
      }
    }
    if (typeof mess.text !== "undefined"){
      alert(mess.text);
    }
  }
});

// send message to background script
//myPort.postMessage({ temp: "something" });

// Create roster button 
createButton();
// Creates roster button if not already on page.
function createButton() {
  var rosterButton = document.getElementById(rosterButtonID);
  if (!rosterButton) { // dirty but should capture all failed cases.
    rosterButton = document.createElement("button");
    rosterButton.id = rosterButtonID;
    // add to page
    document.getElementsByClassName("enrolusersbutton")[0].appendChild(rosterButton);
  }
  // set (or reset) defaults
  rosterButton.onclick = toggleRoster; // click event was being lost on reload of page.
  rosterButton.innerText = "Show Roster";
  rosterButton.setAttribute("data-showing", false);
}


function toggleRoster(evt) {
  var showing = this.getAttribute("data-showing");
  //showing = true && showing;
  if (showing == "false") {
    // show roster
    setRosterCSS(true);
    this.setAttribute("data-showing", true);
    this.innerText = "Hide Roster";
    changeImageSize(true);
  } else {
    // hide roster
    setRosterCSS(false);
    this.setAttribute("data-showing", false);
    this.innerText = "Show Roster";
    changeImageSize(false);
  }
}

// adjust image sizes

function changeImageSize(increase) {
  var imgs = document.getElementsByClassName("userpicture");
  var find = "/f2";
  var replace = "/f3";
  if (!increase) {
    var tmp = replace;
    replace = find;
    find = tmp;
  }
  for (let img of imgs) {
    var oldSrc = img.src;
    var startIndex = oldSrc.indexOf(find);
    var newSrc = oldSrc.substr(0, startIndex) + replace;
    img.src = newSrc;
  }
}


// this just causes weird behavior. Decided not to do it. 
// I would have to not to the render until the new page loads. 
// function clickShowAll(showAll){
//   var links = document.getElementsByTagName("a");
//   for(let lnk of links){
//     let dataAction = lnk.getAttribute("data-action");
//     if (typeof dataAction !== "undefined" && dataAction !== null){
//       if (dataAction === "showcount"){
//         var newPage = lnk.href + "&imgquality=high";
//         alert(newPage);
//         window.location = newPage;
//       }
//     }
//   }
// }


// this does now work because of host permissions. 
async function setRosterCSS(turnOn) {
  // call background process where we add the css file. 
  if (turnOn) {
    myPort.postMessage({ "showRoster": true });
  } else {
    // turn roster off.
    myPort.postMessage({ "showRoster": false });
  }

}

// alert("start");
// //var tabs = await browser.tabs.query({ currentWindow: true, active: true });
// // var currTabID = tabs[0].id;
// // browser.tabs.insertCSS(currTabID, { code: ROSTERCSS });

// // var tabsList = browser.tabs.query({});
// // alert(tabsList);
// // browser.tabs.insertCSS({code:testCSS});

// // var sheets = document.styleSheets;
// // alert(sheets.cssRules);
// //sheets.insertRule("#participants .c1 img {height: 80px;width: 80px;display: block;margin: auto;}",sheets.cssRules.length);
// alert("finish");

































const ROSTERCSS = `#participants tr, #participants td{
    display: block;
  }
  #participants tr{
    display: inline-block;
    width: 20%;
    text-align:center;
  }
  #participants .c3, #participants .c4, #participants .c5, #participants .c6{ display: none;}
  #participants .cell.c1 {
    font-size: 1.5em;
    text-align: center;
    margin: 0;
  }
  #participants .c1 img {
      height: 80px;
      width: 80px;
      display: block;
      margin: auto;
  }
  .filter-group{display: none;}`;


