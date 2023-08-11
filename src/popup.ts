let toggle = false;

document.addEventListener("DOMContentLoaded", function () {
  const darkenBtn = document.getElementById("enable_button");
  const bgEffectContainer = document.querySelector(".bg-eff");
  const buttonImage = document.querySelector(".btn-img");
  const inputLabel = document.querySelector(".container");

  // onClick's logic below:
  darkenBtn?.addEventListener("click", function () {
    if (toggle) {
      bgEffectContainer?.classList.remove("bg-move");
      buttonImage?.classList.remove("border-dark");
      darkenBtn?.classList.remove("bg-white");
      darkenBtn?.style.setProperty("--hover-shadow-color", "#414141");
      inputLabel?.classList.remove("color-light");

      toggle = !toggle;
    } else {
      bgEffectContainer?.classList.add("bg-move");
      buttonImage?.classList.add("border-dark");
      darkenBtn?.classList.add("bg-white");
      darkenBtn?.style.setProperty("--hover-shadow-color", "#ffffff");
      inputLabel?.classList.add("color-light");

      toggle = !toggle;
    }
  });
});
