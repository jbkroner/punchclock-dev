import { Session } from "./Session.js";
import { TabData } from "./TabData.js";
import { HostData } from "./HostData.js";
import { isTrackedHostname } from "./hostname.js";

let sessionData = new Session();

chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function (tab) {
    // ** PRE PROCESSING ** //
    var currentHostname = new URL(tab.url).hostname;
    var activationTime = Date.now();

    // ** EVENT PROCESSING ** //

    // sub in dummy hostname if this is untracked
    if (!isTrackedHostname(currentHostname)) {
      console.debug("untracked hostname");
      currentHostname = "untracked";
    }

    // create add this tab to the session if it doesn't already exist
    if (!sessionData.tabs.get(tab.id)) {
      sessionData.tabs.set(tab.id, new TabData(currentHostname));
      ;
    }
    console.info(
      `new tab activation event, now tracking session data for tab ${tab.id}`
    );

    // add this hostname if it doesn't aready exist
    if (!sessionData.tabs.get(tab.id).hostnames.get(currentHostname)) {
      console.info(
        `adding ${currentHostname} to known hostnames for tab ${tab.id}`
      );
      sessionData.tabs
        .get(tab.id)
        .hostnames.set(
          currentHostname,
          new HostData(currentHostname)
        );
    }

    // log known hostnames
    let hostnames = sessionData.tabs.get(tab.id).hostnames.keys();
    console.debug(`known hostnames for tab ${tab.id}: ${[...hostnames]}`);

    // update data for hostname
    if (sessionData.previousTab) {
      console.debug(`previousTab id + hostname ${sessionData.previousTab.id}:${sessionData.tabs.get(sessionData.previousTab.id).previousHostname}`);

      sessionData.tabs.get(tab.id).hostnames.get(currentHostname).activationTime = activationTime;
      sessionData.tabs.get(sessionData.previousTab.id).hostnames.get(sessionData.previousHostname).deactivationTime = activationTime;

      var elapsedTime = sessionData.tabs.get(sessionData.previousTab.id).hostnames.get(sessionData.previousHostname).activationTime - activationTime;
      console.debug(`elapsed time for tab ${sessionData.previousTab.id}: ${elapsedTime}`);
      sessionData.tabs.get(sessionData.previousTab.id).hostnames.get(sessionData.previousHostname).totalTime += elapsedTime;
      console.debug(`total elpased time for tab ${sessionData.previousTab.id}: ${sessionData.tabs.get(sessionData.previousTab.id).hostnames.get(sessionData.previousHostname).totalTime}`);
      


    }

    // ** POST EVENT PROCESSING
    sessionData.previousTab = tab;

  });
});
