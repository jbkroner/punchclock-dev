console.log("This is a HI!")

chrome.tabs.query(
    {active: true, currentWindow: true}, 
    function (tabs){
        let currentTab = tabs[0];
        let currentUrl = currentTab.url;
        console.log(currentUrl);
    }
);

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    // check if the current url matches the urls in your config file
    var urlsToCheck = ["google.com","hackernews.com"];
    if(urlsToCheck.indexOf(new URL(tab.url).hostname) !== -1){
      console.log(tab.url + " is in the list");
    }
  }
});
