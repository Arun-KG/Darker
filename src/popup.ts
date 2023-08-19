import { Message, MessageType, MessageCatagory } from "./types";

document.addEventListener("DOMContentLoaded", function () {
  enum UiMode {
    DARK,
    LIGHT,
  }

  let toggle = false;
  let uiMode: UiMode;

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
      uiMode = UiMode.DARK;
    } else {
      bgEffectContainer?.classList.remove("bg-move");
      buttonImage?.classList.remove("border-dark");
      darkenBtn?.classList.remove("bg-white");
      inputLabel?.classList.remove("color-light");

      darkenBtn?.style.setProperty("--hover-shadow-color", "#414141");

      toggle = !toggle;
      uiMode = UiMode.LIGHT;
    }
  }

  async function SendMessageToContentScript(message: Message, callback: (response: Message) => void): Promise<void> {
    chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
      const tabId: number = tabs[0].id || 0;
      const response: Message = await chrome.tabs.sendMessage(tabId, message);
      callback(response);
    });
  }

  // Popup initialization
  (() => {
    (async () => {
      SendMessageToContentScript(
        {
          from: MessageType.POPUP,
          to: MessageType.SERVICE_WORKER,
          catagory: MessageCatagory.REQUEST,
          signature: "POPUP_INITIALIZATION",
          message: "popup initilization",
        },
        (response) => {
          if (Object.keys(response.message).length === 0) {
            rememberCheckbox.checked = false;
            setUiMode(UiMode.LIGHT);
          } else {
            rememberCheckbox.checked = true;
            setUiMode(UiMode.DARK);
          }
        }
      );
    })();
  })();

  // onClick's logic below:
  darkenBtn?.addEventListener("click", function () {
    if (toggle) {
      setUiMode(UiMode.LIGHT);
    } else {
      setUiMode(UiMode.DARK);
    }

    SendMessageToContentScript(
      {
        from: MessageType.POPUP,
        to: MessageType.CONTENT_SCRIPT,
        catagory: MessageCatagory.REQUEST,
        signature: "DARKEN_BUTTON_CLICK",
        message: { uiMode },
      },
      (response) => {
        console.info(response);
      }
    );
  });

  // Remember site checkbox event listener
  rememberCheckbox?.addEventListener("change", () => {
    SendMessageToContentScript(
      {
        from: MessageType.POPUP,
        to: MessageType.CONTENT_SCRIPT,
        catagory: MessageCatagory.REQUEST,
        signature: "SAVE_SITE_NAME_TO_STORAGE",
        message: { state: rememberCheckbox.checked },
      },
      (response) => {
        console.log(response);
        if (uiMode === UiMode.LIGHT && rememberCheckbox.checked) setUiMode(UiMode.DARK);
      }
    );
  });
});
