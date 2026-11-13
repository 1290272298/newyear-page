const $ = (id) => document.getElementById(id);

const scenes = [
  {
    video: "assets/videos/scene-01-opening.mp4",
    poster: "assets/images/scene-01.jpg",
    eyebrow: "SCENE 01 · THE BEGINNING",
    title: "新的篇章，即将开启",
    description: "黑夜渐亮，愿望正在悄悄发芽。"
  },
  {
    video: "assets/videos/scene-02-city.mp4",
    poster: "assets/images/scene-02.jpg",
    eyebrow: "SCENE 02 · CITY OF LIGHTS",
    title: "让城市为新年闪耀",
    description: "把过去一年的故事，化作夜空中最璀璨的光。"
  },
  {
    video: "assets/videos/scene-03-wishes.mp4",
    poster: "assets/images/scene-03.jpg",
    eyebrow: "SCENE 03 · A WISH FOR YOU",
    title: "把美好与希望送给你",
    description: "愿所念皆如愿，所行皆坦途。"
  },
  {
    video: "assets/videos/scene-04-finale.mp4",
    poster: "assets/images/scene-04.jpg",
    eyebrow: "SCENE 04 · WELCOME 2027",
    title: "HAPPY NEW YEAR 2027",
    description: "新年快乐，愿每一个明天都值得期待。"
  }
];

let currentScene = 0;
let isMuted = true;
const video = $("sceneVideo");
const music = $("bgMusic");
const videoStage = document.querySelector(".video-stage");
const fullscreenBtn = $("fullscreenBtn");

function showPage(id) {
  ["welcomePage", "introPage", "filmPage", "endingPage"].forEach(page => $(page).classList.add("hidden"));
  $(id).classList.remove("hidden");
}

function startMusic() {
  music.volume = 0.55;
  music.play().then(() => $("musicControl").classList.remove("hidden")).catch(() => {
    // 浏览器可能要求用户再次点击音乐按钮。
    $("musicControl").classList.remove("hidden");
  });
}

function openGift() {
  showPage("introPage");
  startMusic();
}
$("openGiftBtn").addEventListener("click", openGift);
$("backToGiftBtn").addEventListener("click", () => showPage("welcomePage"));

function playScene(index) {
  currentScene = index;
  if (index >= scenes.length) {
    video.pause();
    showPage("endingPage");
    // 进入结束页面，恢复背景音乐
    $("musicControl").classList.remove("hidden");
    music.play().catch(() => {});
    $("musicControl").classList.remove("hidden");
    return;
  }
  // 根据当前视频自动控制背景音乐
  // 第1个视频：开启背景音乐
  // 第2～第4个视频：关闭背景音乐
  // 只有第2、3、4个视频播放期间暂停背景音乐
if (index === 0 || index === 1 || index === 2 || index === 3) {
    music.pause();
    $("musicControl").classList.add("hidden");
} else {
    music.play().catch(() => {});
    $("musicControl").classList.remove("hidden");
}
  const scene = scenes[index];
  $("sceneCounter").textContent = `SCENE ${String(index + 1).padStart(2, "0")} / 04`;
  $("sceneEyebrow").textContent = scene.eyebrow;
  $("sceneTitle").textContent = scene.title;
  $("sceneDescription").textContent = scene.description;
  video.pause();
  video.src = scene.video;
  video.poster = scene.poster;
  video.load();
  showPage("filmPage");
  video.play().then(() => $("pauseBtn").textContent = "Ⅱ").catch(() => {
    $("pauseBtn").textContent = "▶";
  });
  $("progressBar").style.width = "0%";
}
$("startFilmBtn").addEventListener("click", () => playScene(0));
$("skipBtn").addEventListener("click", () => playScene(currentScene + 1));
video.addEventListener("ended", () => playScene(currentScene + 1));
video.addEventListener("timeupdate", () => {
  if (video.duration && Number.isFinite(video.duration)) {
    $("progressBar").style.width = `${(video.currentTime / video.duration) * 100}%`;
  }
});
$("pauseBtn").addEventListener("click", () => {
  if (video.paused) {
    video.play().then(() => $("pauseBtn").textContent = "Ⅱ").catch(() => {});
  } else {
    video.pause();
    $("pauseBtn").textContent = "▶";
  }
});
$("muteBtn").addEventListener("click", () => {
  isMuted = !isMuted;
  video.muted = isMuted;
  $("muteBtn").textContent = isMuted ? "♫" : "♪";
});

// 视频放大：先启用页面全屏备用模式，再尝试浏览器原生全屏
function setFallbackFullscreen(enabled) {
  videoStage.classList.toggle("is-expanded", enabled);
  document.body.classList.toggle("video-expanded", enabled);
  fullscreenBtn.setAttribute("aria-label", enabled ? "退出全屏" : "全屏显示");
  fullscreenBtn.title = enabled ? "退出全屏" : "全屏显示";
  fullscreenBtn.textContent = enabled ? "×" : "⛶";
}

function enterVideoFullscreen() {
  // 再次点击时退出页面全屏
  if (videoStage.classList.contains("is-expanded")) {
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    setFallbackFullscreen(false);
    return;
  }

  // 先立即展开，确保原生全屏不支持时也能放大
  setFallbackFullscreen(true);

  // iOS Safari 原生视频全屏
  if (typeof video.webkitEnterFullscreen === "function") {
    try {
      video.controls = true;
      video.webkitEnterFullscreen();
      return;
    } catch (error) {
      video.controls = false;
    }
  }

  // 其他支持 Fullscreen API 的浏览器
  if (typeof videoStage.requestFullscreen === "function") {
    try {
      const request = videoStage.requestFullscreen();
      if (request && typeof request.catch === "function") {
        request.catch(() => {
          // 保留页面全屏备用模式
        });
      }
    } catch (error) {
      // 保留页面全屏备用模式
    }
  }
}

fullscreenBtn.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  enterVideoFullscreen();
});

function syncFullscreenButton() {
  // 原生全屏退出后，恢复页面状态
  if (!document.fullscreenElement && videoStage.classList.contains("is-expanded")) {
    setFallbackFullscreen(false);
  } else {
    const expanded = Boolean(document.fullscreenElement) ||
      videoStage.classList.contains("is-expanded");
    fullscreenBtn.setAttribute("aria-label", expanded ? "退出全屏" : "全屏显示");
    fullscreenBtn.title = expanded ? "退出全屏" : "全屏显示";
    fullscreenBtn.textContent = expanded ? "×" : "⛶";
  }
}

document.addEventListener("fullscreenchange", syncFullscreenButton);
video.addEventListener("webkitbeginfullscreen", () => {
  video.controls = true;
});
video.addEventListener("webkitendfullscreen", () => {
  video.controls = false;
  setFallbackFullscreen(false);
});

$("musicControl").addEventListener("click", () => {
  if (music.paused) {
    music.play().then(() => $("musicControl").innerHTML = "♫ <span>音乐 ON</span>").catch(() => {});
  } else {
    music.pause();
    $("musicControl").innerHTML = "♫ <span>音乐 OFF</span>";
  }
});

$("replayBtn").addEventListener("click", () => {
  music.currentTime = 0;
  playScene(0);
});
$("blessingBtn").addEventListener("click", () => $("blessingModal").classList.remove("hidden"));
$("closeModalBtn").addEventListener("click", () => $("blessingModal").classList.add("hidden"));
$("blessingModal").addEventListener("click", (event) => {
  if (event.target === $("blessingModal")) $("blessingModal").classList.add("hidden");
});
// 打开祝福弹窗时，恢复背景音乐
$("musicControl").classList.remove("hidden");
music.play().catch(() => {});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") $("blessingModal").classList.add("hidden");
});
// 2027 新年倒计时
function updateCountdown() {
    // 日本当地时间：2027年1月1日 00:00:00
    const targetDate = new Date("2027-01-01T00:00:00+09:00").getTime();
    const now = Date.now();

    let distance = targetDate - now;

    if (distance <= 0) {
        document.getElementById("countdown").innerHTML =
            '<div class="countdown-finished">2027 新年快乐！</div>';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    document.getElementById("days").textContent = String(days).padStart(3, "0");
    document.getElementById("hours").textContent = String(hours).padStart(2, "0");
    document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
    document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

// 页面加载后立即执行，每秒更新
updateCountdown();
setInterval(updateCountdown, 1000);