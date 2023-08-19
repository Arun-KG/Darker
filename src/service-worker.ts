(() => {
  console.log("service worker");

  enum UiMode {
    DARK,
    LIGHT,
  }

  enum MessageType {
    CONTENT_SCRIPT,
    POPUP,
    SERVICE_WORKER,
    EMPTY,
  }

  enum MessageCatagory {
    REQUEST,
    RESPONSE,
    EMPTY,
  }

  type Message = {
    from: MessageType;
    to: MessageType;
    catagory: MessageCatagory;
    signature: string;
    message: any | undefined;
  };

  //####################################################################################
  // Removes everything form storage [FOR DEBUG ONLY!]
  //chrome.storage.sync.clear();
  //####################################################################################

  // Service worker initialization
  (() => {
    SetCurrent("NULL");
  })();

  function SetCurrent(url: string): void {
    chrome.storage.sync.set({ ["Current"]: url });
  }

  function GetCurrent(callback: (result: any) => void) {
    chrome.storage.sync.get("Current").then((result) => {
      callback(result);
    });
  }

  function GetData(key: string, callback: (result: any) => void): void {
    chrome.storage.sync.get(key).then((result) => {
      callback(result);
    });

    // .then((result) => {
    //   callback(result);
    // }

    // chrome.storage.sync.get({ key }, (result) => {
    //   callback(result);
    // });
  }

  function SetData(value: string) {
    chrome.storage.sync.set({ [value]: value }).then(() => {
      console.log("Value is set");
    });
  }

  function DeleteData(key: string) {
    chrome.storage.sync.remove(key);
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const req: Message = request;

    let m_tempUrl: string = sender.tab?.url || "NULL";
    let m_url = new URL(m_tempUrl);

    function MakeSiteDark(dark: boolean): void {
      if (dark) {
        chrome.scripting.insertCSS({
          target: { tabId: sender.tab?.id || 0 },
          css: "html{ filter: invert(1) !important; }",
        });
      } else {
        chrome.scripting.removeCSS({
          target: { tabId: sender.tab?.id || 0 },
          css: "html{ filter: invert(1) !important; }",
        });
      }
    }

    //function MakeSiteDark(): void {}

    switch (req.from) {
      case MessageType.POPUP: {
        break;
      }
      case MessageType.CONTENT_SCRIPT: {
        switch (req.signature) {
          case "PAGE_INITIALIZATION": {
            GetCurrent((resp) => {
              if (resp.Current === m_url.hostname && resp.Current !== "NULL") {
                MakeSiteDark(true);

                SetCurrent(m_url.hostname);

                sendResponse({
                  from: MessageType.SERVICE_WORKER,
                  to: MessageType.CONTENT_SCRIPT,
                  catagory: MessageCatagory.RESPONSE,
                  signature: "PAGE_INITIALIZATION_RESPONSE",
                  message: { mode: UiMode.DARK },
                });
              } else {
                SetCurrent("NULL");

                sendResponse({
                  from: MessageType.SERVICE_WORKER,
                  to: MessageType.CONTENT_SCRIPT,
                  catagory: MessageCatagory.RESPONSE,
                  signature: "PAGE_INITIALIZATION_RESPONSE",
                  message: { mode: UiMode.LIGHT },
                });
              }
            });

            //chrome.tabs.insertCSS({ code: "html{ filter: invert(1); }" });

            GetData(m_url.hostname, (dbRes) => {
              if (Object.keys(dbRes).length !== 0) MakeSiteDark(true);

              console.log(dbRes);

              sendResponse({
                from: MessageType.SERVICE_WORKER,
                to: MessageType.CONTENT_SCRIPT,
                catagory: MessageCatagory.RESPONSE,
                signature: "PAGE_INITIALIZATION_RESPONSE",
                message: dbRes,
              });
            });

            chrome.storage.sync.get(null, (items) => {
              console.log(items);
            });

            break;
          }
          case "POPUP_INITIALIZATION": {
            GetData(m_url.hostname, (res) => {
              sendResponse({
                from: MessageType.SERVICE_WORKER,
                to: MessageType.CONTENT_SCRIPT,
                catagory: MessageCatagory.RESPONSE,
                signature: "POPUP_INITIALIZATION_RESPONSE",
                message: res,
              });
            });

            break;
          }
          case "SAVE_SITE_NAME_TO_STORAGE": {
            //console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");

            //console.log("SAVE_SITE_NAME_TO_STORAGE Host: " + m_url.hostname);
            console.log("remember changed!");
            req.message.state ? SetData(m_url.hostname) : DeleteData(m_url.hostname);

            // if (req.message.state) SetData(m_url.hostname);
            // else DeleteData(m_url.hostname);

            sendResponse({
              from: MessageType.SERVICE_WORKER,
              to: MessageType.CONTENT_SCRIPT,
              catagory: MessageCatagory.RESPONSE,
              signature: "test",
              message: `Response to ${req.message.state}`,
            });

            break;
          }
          case "DARKEN_BUTTON_CLICK": {
            //MakeSiteDark((req.message.uiMode as UiMode) === UiMode.LIGHT ? SiteMode.DARK : SiteMode.LIGHT);
            SetCurrent(m_url.hostname);

            GetCurrent((resp) => {
              if (resp.Current === m_url.hostname && resp.Current !== "NULL") {
                MakeSiteDark(true);

                sendResponse({
                  from: MessageType.SERVICE_WORKER,
                  to: MessageType.CONTENT_SCRIPT,
                  catagory: MessageCatagory.RESPONSE,
                  signature: "DARKEN_BUTTON_CLICK_RESPONSE",
                  message: { mode: UiMode.DARK },
                });
              } else {
                SetCurrent("NULL");

                sendResponse({
                  from: MessageType.SERVICE_WORKER,
                  to: MessageType.CONTENT_SCRIPT,
                  catagory: MessageCatagory.RESPONSE,
                  signature: "DARKEN_BUTTON_CLICK_RESPONSE",
                  message: { mode: UiMode.LIGHT },
                });
              }
            });
          }
        }

        break;
      }
    }
    return true;
  });
})();
