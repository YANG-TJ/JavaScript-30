const buttons = document.querySelectorAll("[data-time]");
const custom = document.querySelector("#custom"); //表單
const display = document.querySelector(".display__time-left");
const displayEnd = document.querySelector(".display__end-time");
let countdown;

function timer(seconds) {
  //清除存在的計時器
  clearInterval(countdown);

  const now = Date.now(); //目前時間戳記
  const then = now + seconds * 1000;
  displayTimeLeft(seconds);
  displayEndTime(then);

  //計時器
  countdown = setInterval(() => {
    const secondLeft = Math.round((then - Date.now()) / 1000);
    if (secondLeft < 0) {
      clearInterval(countdown);
      return;
    }
    displayTimeLeft(secondLeft); //顯示當前秒數
  }, 1000);
}

//倒數計時器
function displayTimeLeft(timing) {
  let hours = Math.floor(timing / 3600);
  let mins = Math.floor(timing / 60) - hours * 60;
  let secs = timing % 60;

  //格式: 00:00:00
  if (hours < 10) hours = `0${hours}`;
  if (mins < 10) mins = `0${mins}`;
  if (secs < 10) secs = `0${secs}`;

  display.textContent = `${hours}:${mins}:${secs}`;
}

//結束時間顯示
function displayEndTime(timestamp) {
  const end = new Date(timestamp);
  const hour = end.getHours();
  const adjustedHour = hour > 12 ? hour - 12 : hour;
  let mins = end.getMinutes();
  if (mins < 10) mins = `0${mins}`;
  let secs = end.getSeconds();
  secs < 10 ? `0{secs}` : `${secs}`;

  displayEnd.textContent = `Be Back At ${adjustedHour}:${mins}:${secs}`;
}

//button 計時器
function startTimer() {
  let seconds = parseInt(this.dataset.time);
  timer(seconds);
}

buttons.forEach((button) => button.addEventListener("click", startTimer));
custom.addEventListener("submit", (e) => {
  e.preventDefault();
  const mins = e.target.querySelector("input").value;

  //輸入非數字時，提醒 + 重設
  if (isNaN(mins)) {
    alert("請輸入數字");
  }else{
    timer(mins * 60);
  }
  e.target.reset(); //重設 input.value
});
