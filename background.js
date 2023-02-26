import { Session } from "./Session.js";
import { TabData } from "./TabData.js";
import { HostData } from "./HostData.js";
import { isTrackedHostname } from "./hostname.js";

let sessionData = new Session();
let previousHostname;
let previousTime = Date.now();

chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function (tab) {
    // ** PRE PROCESSING ** //
    var currentHostname = new URL(tab.url).hostname;
    var activationTime = Date.now();

    // ** EVENT PROCESSING ** //

    // sub in dummy hostname if this is untracked
    if (!isTrackedHostname(currentHostname)) {
      console.log("untracked hostname");
      currentHostname = "untracked";
    }

    // create add this tab to the session if it doesn't already exist
    if (!sessionData.tabs.get(tab.id)) {
      sessionData.tabs.set(tab.id, new TabData(currentHostname));
      console.log(
        `new tab activation, now tracking session data for tab ${tab.id}`
      );
    }

    // add this hostname if it doesn't aready exist
    if (!sessionData.tabs.get(tab.id).hostnames.get(currentHostname)) {
      console.log(
        `adding ${currentHostname} to known hostnames for tab ${tab.id}`
      );
      sessionData.tabs
        .get(tab.id)
        .hostnames.set(
          currentHostname,
          new HostData(currentHostname, activationTime)
        );
    } else {
      console.log(`updating host ${currentHostname} for tab ${tab.id}`);
      sessionData.tabs
        .get(tab.id)
        .hostnames.get(currentHostname).activationTime = activationTime;
    }

    // log known hostnames
    let hostnames = sessionData.tabs.get(tab.id).hostnames.keys();
    console.log(`known hostnames for tab ${tab.id}: ${[...hostnames]}`);

    // check if this is different than the previous hostname on this tab
    var previousHostname = sessionData.tabs.get(tab.id).previousHostname;

    // if this hostname is the same then calculate the difference in time
    if (previousHostname == currentHostname) {
      const previousTime = sessionData.tabs.get(tab.id).previousTime;
      const timeOnPreviousTab = activationTime - previousTime;
      sessionData.tabs.get(tab.id).totalTime += timeOnPreviousTab;
      console.log(`previous time on tab ${tab.id}: ${timeOnPreviousTab}`);
      console.log(
        `total time on this hostname: ${sessionData.tabs.get(tab.id).totalTime}`
      );
    }

    // ** POST PROCESSING ** //
    sessionData.tabs.get(tab.id).previousHostname = currentHostname;
  });
});
