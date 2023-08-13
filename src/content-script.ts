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

  (async () => {
    const message: Message = {
      from: MessageType.CONTENT_SCRIPT,
      to: MessageType.SERVICE_WORKER,
      catagory: MessageCatagory.REQUEST,
      signature: "TEST",
      message: "test message from content script",
    };

    const response = await chrome.runtime.sendMessage(message);
    // do something with response here, not outside the function
    console.log(response as Message);
  })();

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    const req: Message = request;

    console.log({ req, sender, sendResponse });

    switch (req.from) {
      case MessageType.POPUP: {
        console.log("inside popup switch");
        switch (req.signature) {
          case "SAVE_SITE_NAME_TO_STORAGE": {
            console.log("inner switch");
            const resp: Message = {
              from: MessageType.CONTENT_SCRIPT,
              to: MessageType.POPUP,
              catagory: MessageCatagory.RESPONSE,
              signature: "SITE_NAME_SAVE_STATUS",
              message: "//save function with boolean reaturn value//" + req.message,
            };
            sendResponse(resp);

            break;
          }
          case "TEST": {
            break;
          }
        }

        break;
      }
      case MessageType.SERVICE_WORKER: {
        break;
      }
    }
  });
})();
