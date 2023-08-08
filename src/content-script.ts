// async function getTabId() {
//   let queryOptions = { active: true, lastFocusedWindow: true };
//   // `tab` will either be a `tabs.Tab` instance or `undefined`.
//   let [tab] = await chrome.tabs.query(queryOptions);
//   return tab;
// }

// console.log(getTabId());

// chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//   var tab = tabs[0];
//   console.log(tab.id);
// });

console.log("content script");

(async () => {
  const response = await chrome.runtime.sendMessage({ greeting: "hello" });
  // do something with response here, not outside the function
  console.log(response);
})();

// let id: number = 0;

// getTabId().then(
//   (tabId) => {
//     id = tabId ? tabId : 0;
//   },
//   (err) => {
//     console.error(err);
//   }
// );

// console.log(id);

// chrome.scripting
//   .insertCSS({
//     target: { tabId: id },
//     css: "html { filter: invert(1); }",
//   })
//   .then(() => console.log("CSS injected"));
