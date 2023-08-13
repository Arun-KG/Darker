import { Message, MessageType, MessageCatagory } from "./types";

document.addEventListener("DOMContentLoaded", function () {
  enum UiMode {
    DARK,
    LIGHT,
  }

  let toggle = false;

  // Initialization
  (function () {
    (async () => {
      const message: Message = {
        from: MessageType.POPUP,
        to: MessageType.SERVICE_WORKER,
        catagory: MessageCatagory.REQUEST,
        signature: "TEST",
        message: "popup initilization",
      };

      const response = await chrome.runtime.sendMessage(message);
      // do something with response here, not outside the function
      console.log(response);
    })();
  })();

  const darkenBtn = document.getElementById("enable_button");
  const rememberCheckbox = document.getElementById("remember") as HTMLInputElement;

  const bgEffectContainer = document.querySelector(".bg-eff");
  const buttonImage = document.querySelector(".btn-img");
  const inputLabel = document.querySelector(".container");

  darkenBtn?.style.setProperty("--hover-shadow-color", "#414141");

  function setUiMode(mode: UiMode) {
    if (mode == UiMode.DARK) {
      bgEffectContainer?.classList.add("bg-move");
      buttonImage?.classList.add("border-dark");
      darkenBtn?.classList.add("bg-white");
      inputLabel?.classList.add("color-light");

      darkenBtn?.style.setProperty("--hover-shadow-color", "#ffffff");

      toggle = !toggle;
    } else {
      bgEffectContainer?.classList.remove("bg-move");
      buttonImage?.classList.remove("border-dark");
      darkenBtn?.classList.remove("bg-white");
      inputLabel?.classList.remove("color-light");

      darkenBtn?.style.setProperty("--hover-shadow-color", "#414141");

      toggle = !toggle;
    }
  }

  async function sendMessageToContentScript(message: Message, callback: (response: Message) => void): Promise<void> {
    chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
      const tabId: number = tabs[0].id || 0;
      const response = await chrome.tabs.sendMessage(tabId, message);
      callback(response);
    });
  }

  // onClick's logic below:
  darkenBtn?.addEventListener("click", function () {
    if (toggle) {
      setUiMode(UiMode.LIGHT);
    } else {
      setUiMode(UiMode.DARK);
    }

    (async () => {
      chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
        const tabId: number = tabs[0].id || 0;
        console.log(tabId);

        const req: Message = {
          from: MessageType.POPUP,
          to: MessageType.CONTENT_SCRIPT,
          catagory: MessageCatagory.REQUEST,
          signature: "TEST",
          message: "test message from popup to content script",
        };

        const response = await chrome.tabs.sendMessage(tabId, req);
        console.log(response as Message);
      });
    })();
  });

  // Remember site checkbox event listener
  rememberCheckbox?.addEventListener("change", () => {
    const message: Message = {
      from: MessageType.POPUP,
      to: MessageType.CONTENT_SCRIPT,
      catagory: MessageCatagory.REQUEST,
      signature: "SAVE_SITE_NAME_TO_STORAGE",
      message: { state: rememberCheckbox.checked },
    };

    sendMessageToContentScript(message, (response: Message) => {
      console.log(response);
    });

    //================================================

    // chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
    //   const tabId: number = tabs[0].id || 0;
    //   console.log(tabId);

    //   const message: Message = {
    //     from: MessageType.POPUP,
    //     to: MessageType.CONTENT_SCRIPT,
    //     catagory: MessageCatagory.REQUEST,
    //     signature: "SAVE_SITE_NAME_TO_STORAGE",
    //     message: { state: rememberCheckbox.checked },
    //   };

    //   const response = await chrome.tabs.sendMessage(tabId, message);
    //   console.log(response as Message);

    //   sendMessageToContentScript(message).then((resp) => {
    //     console.log(resp);
    //   });
    // });

    /////////////////////////////
  });
});
