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

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    const req: Message = request;
    console.log({ req, sender });

    switch (req.from) {
      case MessageType.POPUP: {
        console.log("From popup to service worker");

        break;
      }
      case MessageType.CONTENT_SCRIPT: {
        console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");

        let m_tempUrl: string = sender.tab?.url || "NULL";
        let m_url = new URL(m_tempUrl);
        console.log("Host: " + m_url.hostname);

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
    }
  });
})();
