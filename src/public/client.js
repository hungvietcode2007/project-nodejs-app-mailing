const dateInput = document.getElementById("specific_date");
const dateLabelText = document.getElementById("date-label-text");
const chooseDateBtn = document.getElementById("choose-date-btn");
const radioInputs = document.querySelectorAll(".radio-input");
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const minDate = tomorrow.toLocaleDateString("en-CA");
if (dateInput) {
  dateInput.min = minDate;
}
if (dateInput) {
  dateInput.addEventListener("change", function () {
    if (this.value) {
      if (radioInputs) {
        radioInputs.forEach((radio) => (radio.checked = false));
      }
      if (dateLabelText) {
        dateLabelText.classList.add("font-semibold");
        dateLabelText.innerText = this.value;
      }
      if (chooseDateBtn) {
        chooseDateBtn.classList.remove("bg-white");
        chooseDateBtn.classList.add("bg-amber-200");
      }
    }
  });
}
if (radioInputs) {
  radioInputs.forEach((radio) => {
    radio.addEventListener("change", function () {
      if (this.checked) {
        if (dateInput) {
          dateInput.value = "";
          chooseDateBtn.classList.remove("bg-amber-100");
          chooseDateBtn.classList.add("bg-white");
          dateLabelText.classList.remove("font-semibold");
          dateLabelText.innerText = "Chọn một ngày cụ thể";
        }
      }
    });
  });
}
const textarea = document.querySelector("#content-input");
if (textarea) {
  textarea.addEventListener("input", function () {
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    if (isDesktop) {
      if (this.scrollHeight > 520) {
        this.style.height = "520px";
        this.style.overflow = "auto";
        this.scrollTop = this.scrollHeight;
      } else {
        this.style.height = "auto";
        this.style.height = this.scrollHeight + "px";
      }
    } else if (!isDesktop) {
      this.style.height = "auto";
      this.style.height = this.scrollHeight + "px";
    }
  });
}
async function copyShareLink(btn) {
  try {
    await navigator.clipboard.writeText("Link share đến landingPage sẽ ở đây");
    const originalIcon = btn.innerHTML;
    btn.innerHTML =
      "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='text-green-600'><path stroke='none' d='M0 0h24v24H0z' fill='none' /><path d='M5 12l5 5l10 -10' /></svg>";
    setTimeout(() => {
      btn.innerHTML = originalIcon;
    }, 3000);
  } catch (err) {
    console.error("Không sao chép được link:", err);
  }
}

const countdownBox = document.querySelector("#countdown");
if (countdownBox) {
  const pendingBox = document.querySelector("#pending");
  const sentBox = document.querySelector("#sent");
  const sendDateStr = countdownBox.dataset.sendDate;
  const sendDate = +new Date(sendDateStr);
  const timer = setInterval(() => {
    const now = Date.now();
    const distance = sendDate - now;
    if (distance <= 0) {
      clearInterval(timer);
      pendingBox.classList.add("hidden");
      sentBox.classList.remove("hidden");
      return;
    }
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    document.getElementById("days").innerText = String(days).padStart(2, "0");
    document.getElementById("hours").innerText = String(hours).padStart(2, "0");
    document.getElementById("minutes").innerText = String(minutes).padStart(
      2,
      "0",
    );
  }, 1000);
}
