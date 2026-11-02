# HPNY2027 — Birthday-page style New Year surprise

这是按照 `1290272298/birthday-page` 的互动方式重新设计的 2027 新年祝福网页，不是 HPNY2026/HPNY2027 倒计时网站的翻版。

## 设计原则：保留生日网页的“打开礼物”体验

1. 初始页：显示 2027 和「打开新年礼物」按钮。
2. 打开礼物：进入祝福首页，启动背景音乐（浏览器允许时）。
3. 播放视频：按顺序播放 4 个镜头；每个视频结束后自动进入下一个。
4. 最终页：显示新年祝福，可重新观看或打开专属祝福弹窗。
5. 音乐控制：全程可暂停/恢复；视频自身默认不强制静音，用户可单独控制视频声音。

## 与 HPNY2027 不重复

- 不包含新年倒计时。
- 不包含社区祝福墙 / LocalStorage 留言。
- 不包含多语言切换系统。
- 不包含 HPNY2027 的玻璃拟态倒计时首页。
- 核心是生日网页式的礼物入口、点击触发、音乐、分镜视频、结尾祝福弹窗。

## 文件结构

```text
HPNY2027_BirthdayStyle/
├── index.html
├── README.md
└── assets/
    ├── css/
    │   └── style.css
    ├── js/
    │   └── script.js
    ├── images/
    │   ├── scene-01.jpg
    │   ├── scene-02.jpg
    │   ├── scene-03.jpg
    │   └── scene-04.jpg
    ├── videos/
    │   ├── scene-01-opening.mp4
    │   ├── scene-02-city.mp4
    │   ├── scene-03-wishes.mp4
    │   └── scene-04-finale.mp4
    └── music/
        └── new-year.mp3
```

## 四个镜头建议

| 镜头 | 内容 | 视频文件 |
|---|---|---|
| 01 序幕 | 夜空由暗转亮，金色粒子汇聚，出现 2027 | `scene-01-opening.mp4` |
| 02 城市跨年 | 城市夜景、灯光、跨年人群与烟花 | `scene-02-city.mp4` |
| 03 新年祝福 | 烟花、香槟/金色光影/温暖画面，叠加祝福文案 | `scene-03-wishes.mp4` |
| 04 结尾高潮 | 盛大烟花，HAPPY NEW YEAR 2027 | `scene-04-finale.mp4` |

## 素材放置

把下载的 MP4 放进 `assets/videos/`，并严格使用上表文件名。把对应 JPG 封面放入 `assets/images/`。背景音乐放入 `assets/music/new-year.mp3`。

- Pixabay 视频搜索：https://pixabay.com/videos/search/newyear/
- Vlipsy 搜索：https://vlipsy.com/search/happy-new-year
- Unsplash 图片搜索：https://unsplash.com/ja/s/%E5%86%99%E7%9C%9F/happy-new-year
- 音乐搜索入口：https://mp3.pm/search?q=new%20year

注意：搜索页不是媒体文件直链。请打开具体素材页面下载文件，并逐项确认授权。MP3.pm 的搜索结果不等于获得音乐版权许可；公开部署请使用明确允许网页播放及公开传播的音乐。影视片段/网络剪辑也需单独确认授权。

## 本地运行

推荐 VS Code 安装 Live Server，然后右键 `index.html` → Open with Live Server。也可部署到 GitHub Pages。

## 替换文字与顺序

打开 `assets/js/script.js`，修改顶部 `scenes` 数组中的 `title`、`description`、`video`、`poster` 即可调整每个镜头。视频结束自动切换；也可以点「下一个镜头」。

## 手机兼容

- 视频使用 `playsinline`，避免 iPhone 强制全屏。
- 音乐由用户点击「打开新年礼物」后启动，符合浏览器自动播放限制。
- 建议 MP4 使用 H.264 编码，1080p，单段尽量压缩至 5–20 MB，并准备 JPG poster。
