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
      console.debug(`untracked hostname: ${currentHostname}`);
      currentHostname = "untracked";
    }

    // if this is an unseen tab start tracking it in the session
    if (!sessionData.tabs.get(tab.id)){
      console.info(`new tab detected (${tab.id}), now tracking in global session data`);
      sessionData.tabs.set(tab.id, new TabData(currentHostname));
    }

    // if this is an unseen hostname start tracking in the session
    if (!sessionData.hostnames.get(currentHostname)){
      console.info(`new hostname detected (${currentHostname}), now tracking in global session data`);
      sessionData.hostnames.set(currentHostname, new HostData(currentHostname));
    }


    // update data for the current hostname in the current tab
    // - 'start' the timer by logging the tab activation time
    sessionData.tabs.get(tab.id).activationTime = activationTime;

    // update data for the previous hostname in the previous tab
    if(sessionData.previousTab){
      const prev = sessionData.previousTab;
      const prevHostname = sessionData.tabs.get(prev.id).hostname

      // calculate elapsed time
      const elapsedTime = activationTime - sessionData.tabs.get(prev.id).activationTime;
      console.debug(`calculated elapsed time ${elapsedTime}`);

      // add it to the relevant session HostData object
      const prevHostData = sessionData.hostnames.get(prevHostname);
      if (prevHostData) {
        prevHostData.totalTime += elapsedTime;
        console.debug(`total on previous hostname ${prevHostData.hostname} time is ${totalTime}`);
      } else {
        console.warn(`previous h ostname ${prevHostname} not found in session data`);
      }
    }



    // console.info(
    //   `new tab activation event, now tracking session data for tab ${tab.id}`
    // );

    // // add this hostname to the session if it doesn't aready exist
    // if(!sessionData.get(currentHostname)){
    //   console.info(`adding ${currentHostname} to global hostname tracking`);
    //   sessionData.hostnames.set(currentHostname, new HostData(currentHostname));
    // }

    // // log known hostnames
    // let hostnames = sessionData.tabs.get(tab.id).hostnames.keys();

    // // update data for hostname
    // if (sessionData.previousTab) {
    //   console.debug(`previousTab id + hostname ${sessionData.previousTab.id}:${sessionData.tabs.get(sessionData.previousTab.id).previousHostname}`);

    //   sessionData.tabs.get(tab.id).hostnames.get(currentHostname).activationTime = activationTime;
    //   sessionData.tabs.get(sessionData.previousTab.id).hostnames.get(sessionData.previousHostname).deactivationTime = activationTime;

    //   var elapsedTime = sessionData.tabs.get(sessionData.previousTab.id).hostnames.get(sessionData.previousHostname).activationTime - activationTime;
    //   console.debug(`elapsed time for tab ${sessionData.previousTab.id}: ${elapsedTime}`);
    //   sessionData.tabs.get(sessionData.previousTab.id).hostnames.get(sessionData.previousHostname).totalTime += elapsedTime;
    //   console.debug(`total elpased time for tab ${sessionData.previousTab.id}: ${sessionData.tabs.get(sessionData.previousTab.id).hostnames.get(sessionData.previousHostname).totalTime}`);
      


    // }

    // ** POST EVENT PROCESSING
    sessionData.previousTab = tab;

  });
});
