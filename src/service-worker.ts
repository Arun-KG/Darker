(() => {
  console.log("service worker");

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

  function GetData(key: string, callback: (result: any) => void) {
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

  // function SetData(value: string) {
  //   chrome.storage.sync.set({ [value]: value }).then(() => {
  //     console.log("Value is set");
  //   });
  // }

  // function DeleteData(key: string) {
  //   chrome.storage.sync.remove(key);
  // }

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    const req: Message = request;

    switch (req.from) {
      case MessageType.POPUP: {
        break;
      }
      case MessageType.CONTENT_SCRIPT: {
        switch (req.signature) {
          case "PAGE_INITIALIZATION": {
            let m_tempUrl: string = sender.tab?.url || "NULL";
            let m_url = new URL(m_tempUrl);
            console.log(m_url.hostname);

            GetData(m_url.hostname, (dbRes) => {
              console.log(dbRes);
            });

            const resp: Message = {
              from: MessageType.SERVICE_WORKER,
              to: MessageType.CONTENT_SCRIPT,
              catagory: MessageCatagory.RESPONSE,
              signature: "test",
              message: `Response to ${req.message}`,
            };
            sendResponse(resp);

            break;
          }
          case "POPUP_INITIALIZATION": {
            //console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");

            let m_tempUrl: string = sender.tab?.url || "NULL";
            let m_url = new URL(m_tempUrl);
            //console.log("POPUP_INITIALIZATION Host: " + m_url.hostname);

            GetData(m_url.hostname, (dbRes) => {
              console.log(dbRes);
            });

            const resp: Message = {
              from: MessageType.SERVICE_WORKER,
              to: MessageType.CONTENT_SCRIPT,
              catagory: MessageCatagory.RESPONSE,
              signature: "test",
              message: `Response to ${req.message}`,
            };
            sendResponse(resp);

            break;
          }
          case "SAVE_SITE_NAME_TO_STORAGE": {
            //console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");

            // let m_tempUrl: string = sender.tab?.url || "NULL";
            //let m_url = new URL(m_tempUrl);
            //console.log("SAVE_SITE_NAME_TO_STORAGE Host: " + m_url.hostname);
            console.log("remember changed!");
            //req.message.state ? SetData(m_url.hostname) : DeleteData(m_url.hostname);

            // if (req.message.state) SetData(m_url.hostname);
            // else DeleteData(m_url.hostname);

            const resp: Message = {
              from: MessageType.SERVICE_WORKER,
              to: MessageType.CONTENT_SCRIPT,
              catagory: MessageCatagory.RESPONSE,
              signature: "test",
              message: `Response to ${req.message.state}`,
            };
            sendResponse(resp);

            break;
          }
          case "DARKEN_BUTTON_CLICK": {
            // chrome.storage.sync.clear(() => {
            //   console.log("sync storage cleared");
            //   chrome.storage.sync.get(null, (result) => {
            //     console.log(result);
            //   });
            // });
            //let m_tempUrl: string = sender.tab?.url || "NULL";
            //let m_url = new URL(m_tempUrl);
            //SetData(m_url.hostname);

            sendResponse({ msg: "Button click registed by the service worker" });
          }
        }

        break;
      }
    }
  });
})();
