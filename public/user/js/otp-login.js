const otpForm = document.querySelector("#otpLoginForm");
const phoneInput = document.querySelector("#phone");
const numberStatus = document.querySelector("#number-status");
const sendOtpSection = document.querySelector("#send-otp");
const loginOtpSection = document.querySelector("#login-otp");
const phoneInputHidden = document.querySelector('#login-otp input[name="phone"]');
const countdownElement = document.querySelector("#countdown");
const resendOtpLink = document.querySelector("#resendOtpLink");
if (otpForm) {
  otpForm.addEventListener("submit", sendOtp);
}
if (resendOtpLink) {
  resendOtpLink.addEventListener("click", sendOtp);
}
function sendOtp(event) {
  event.preventDefault();
  resendOtpLink.style.display = "none";
  const phoneNumber = phoneInput.value;
  axios
    .post("/send-otp", { phone: phoneNumber })
    .then((response) => {
      numberStatus.textContent = response.data;
      if (response.data === "OTP sent successfully") {
        sendOtpSection.style.display = "none";
        loginOtpSection.style.display = "block";
        phoneInputHidden.value = phoneNumber;
        startCountdown(10);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function startCountdown(seconds) {
  let remainingSeconds = seconds;
  countdownElement.textContent = `Resend OTP in ${remainingSeconds} seconds`;
  const intervalId = setInterval(() => {
    remainingSeconds--;
    if (remainingSeconds === 0) {
      clearInterval(intervalId);
      countdownElement.textContent = "";
      resendOtpLink.style.display = "inline";
    } else {
      countdownElement.textContent = `Resend OTP in ${remainingSeconds} seconds`;
    }
  }, 1000);
}
