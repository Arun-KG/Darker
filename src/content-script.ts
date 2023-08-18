(() => {
  console.log("content script");

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

  async function SendMessageToServiceWorker(message: Message, callback: (response: Message) => void): Promise<void> {
    const response = await chrome.runtime.sendMessage(message);

    callback(response);
  }

  (async () => {
    SendMessageToServiceWorker(
      {
        from: MessageType.CONTENT_SCRIPT,
        to: MessageType.SERVICE_WORKER,
        catagory: MessageCatagory.REQUEST,
        signature: "PAGE_INITIALIZATION",
        message: "Page Initialization req",
      },
      (response) => {
        console.log("dfgfdgdf");
        console.log(response);
      }
    );
  })();

  chrome.runtime.onMessage.addListener(function (request, _sender, sendResponse) {
    const req: Message = request;

    switch (req.from) {
      case MessageType.POPUP: {
        switch (req.signature) {
          case "SAVE_SITE_NAME_TO_STORAGE": {
            SendMessageToServiceWorker(
              {
                from: MessageType.CONTENT_SCRIPT,
                to: MessageType.SERVICE_WORKER,
                catagory: req.catagory,
                signature: req.signature,
                message: req.message,
              },
              (response) => {
                sendResponse(response);
              }
            );

            break;
          }
          case "POPUP_INITIALIZATION": {
            SendMessageToServiceWorker(
              {
                from: MessageType.CONTENT_SCRIPT,
                to: MessageType.SERVICE_WORKER,
                catagory: req.catagory,
                signature: req.signature,
                message: req.message,
              },
              (response) => {
                sendResponse(response);
              }
            );

            break;
          }
          case "DARKEN_BUTTON_CLICK": {
            SendMessageToServiceWorker(
              {
                from: MessageType.CONTENT_SCRIPT,
                to: MessageType.SERVICE_WORKER,
                catagory: req.catagory,
                signature: req.signature,
                message: req.message,
              },
              (response) => {
                sendResponse(response);
              }
            );

            break;
          }
        }

        break;
      }
      case MessageType.SERVICE_WORKER: {
        break;
      }
    }
    return true;
  });
})();
