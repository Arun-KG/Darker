console.log("service worker");

// Send message to a content script
// (async () => {
//   const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });

//   const tabId: number = tab.id ? tab.id : 0;
//   const response = await chrome.tabs.sendMessage(tabId, { greeting: "hello" });
//   // do something with response here, not outside the function
//   console.log(response);
// })();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
  if (request.greeting === "hello") sendResponse({ farewell: "goodbye" });
});
