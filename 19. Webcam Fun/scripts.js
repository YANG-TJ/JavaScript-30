const video = document.querySelector(".player");
const canvas = document.querySelector(".photo");
const ctx = canvas.getContext("2d");
const strip = document.querySelector(".strip");
const snap = document.querySelector(".snap");

/*
video:原始鏡頭的位置
canvas:擷取鏡頭的內容渲染在畫布上，也是特效會呈現的位置。
strip:產生圖檔的位置。
snap:點擊照相時產生的音效(click)。
*/

function getVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((localMediaStream) => {
      console.log(localMediaStream);
      //video.src = window.URL.createObjectURL(localMediaStream); url生命週期與創造它的 window一致(已棄用)
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch((err) => console.log(`You must deny the webcam permission`, err));
}

//擷取資料放在畫布(canvas)上
function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  //setInterval(function(){},minSecs)
  return setInterval(() => {
    //ctx.drawImage(img, x, y, width, height) 擷取畫面
    ctx.drawImage(video, 0, 0, width, height);
    let pixels = ctx.getImageData(0, 0, width, height); //ctx.getImageData(x, y, width, height) 得到 ImageData對象

    //上特效
    // pixels = redEffect(pixels);
    // pixels =rgbSplit(pixels)
    // pixels = greenScreen(pixels);

    ctx.putImageData(pixels, 0, 0); //ctx.putImageData(img, x, y)
  }, 16);
}

//拍照
function takePhoto() {
  //拍照聲音
  snap.currentTime = 0;
  snap.play();

  //擷取畫面
  const data = canvas.toDataURL("image/jpeg");
  const link = document.createElement("a");
  link.href = data;
  link.setAttribute("download", "youuuu");
  link.innerHTML = `<img src="${data}" alt="YourPhto" />`;

  strip.insertBefore(link, strip.firstChild); //strip.insertBefore(data, location), location使用: firstChild, lastChild, childNode[key]
  console.log(link);
}

//特效
function redEffect(pixels) {
  //pixels.data[]= [red(data[i]), green(data[i+1]), blue(data[i+2]), alpha(data[i+3])], 每一組rgba(i+=4)
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 200; //red: 加深
    pixels.data[i + 1] = pixels.data[i + 1] + -50; //green
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; //blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; //red
    pixels.data[i - 500] = pixels.data[i + 1]; //green
    pixels.data[i - 550] = pixels.data[i + 2]; //blue
  }
  return pixels;
}

//html 6個 bar range
function greenScreen(pixels) {
  const levels = {};
  document.querySelectorAll(".rgb input").forEach((input) => {
    levels[input.name] = input.value;
  });
  for (let i = 0; i < pixels.data.length; i += 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (
      red >= levels.rmin &&
      red <= levels.rmax &&
      green >= levels.gmin &&
      green <= levels.gmax &&
      blue >= levels.bmin &&
      blue <= levels.bmax
    ) {
      pixels.data[i + 3] = 0;
    }
  }
  return pixels;
}

getVideo();
video.addEventListener("canplay", paintToCanvas);
