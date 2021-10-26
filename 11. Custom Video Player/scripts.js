const player = document.querySelector(".player"); //最外層的 div
const video = player.querySelector(".viewer"); //影片的 div
const progress = player.querySelector(".progress"); //影片播放 bar的外層 div
const progressBar = player.querySelector(".progress__filled"); //影片播放 bar的˙ div
const toggle = player.querySelector(".toggle"); //播放按鈕
const skipButton = player.querySelectorAll("button[data-skip]"); //2個 skip的 div
const ranges = player.querySelectorAll(".player__slider"); //聲音大小和撥放速度 bar

//播放、暫停
function togglePlay() {
  const method = video.paused ? "play" : "pause";
  video[method]();
}

video.addEventListener("click", togglePlay);
toggle.addEventListener("click", togglePlay);
window.addEventListener('keydown',(e)=>e.code==='space'?togglePlay:'')

//播放鍵的樣式改變
function updateButton(e) {
  const icon = e.target.paused ? "►" : "❚ ❚";
  toggle.textContent = icon;
}
video.addEventListener("play", updateButton);
video.addEventListener("pause", updateButton);

//快轉, data-skip有 -10, +25, this.dataset.xxx 取值
function skip() {
  const skip = this.dataset.skip;
  video.currentTime += parseFloat(skip); //parseFloat() 將字串轉為 number
}
skipButton.forEach((button) => button.addEventListener("click", skip));

//音量控制、影片播放速度(not working)
function handleRangeChange() {
  video[this.name] = this.value;
}

ranges.forEach((range) => range.addEventListener("change", handleRangeChange));

ranges.forEach((range) => range.addEventListener("mouseover", handleRangeChange));

//播放 bar
function handleProgress(){
    //video.currentTime: 影片當前值
    //video.duration: 影片全長
    const percent = (video.currentTime/video.duration)*100
    progressBar.style.flexBasis=`${percent}%`;
}
video.addEventListener('timeupdate',handleProgress)

//拖拉播放 bar效果
function scrub(e){
    //e.offsetX 當前 div的值, progress.offsetWidth div的全長
    const scrubTime=(e.offsetX/progress.offsetWidth)*video.duration
    video.currentTime=scrubTime
}

//mousedown: 按下為 true, 放開為 false
//mousemove 移動, mousedown為 true執行 scrub
let mousedown=false
progress.addEventListener('click',scrub)
progress.addEventListener('mousemove',(e)=>mousedown &&scrub(e))
progress.addEventListener('mousedown',()=>mousedown=true)
progress.addEventListener('mouseup',()=>mousedown=false)