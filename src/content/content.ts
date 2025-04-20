import { observeUrlChange } from "../lib";

console.log("Content script loaded");

let currentVideoId: null | string = null;

chrome.storage.sync.get(["returnDislikes"], (data) => {
  if (data.returnDislikes === undefined) {
    chrome.storage.sync.set({ returnDislikes: true }, () => {
      console.log("returnDislikes set to true");
    });
  }
});

// refactorng
observeUrlChange(() => {
  chrome.storage.sync.get(["returnDislikes", "sponsorBlock"], (settings) => {
    if (settings.returnDislikes) runDislikeFeature();
    if (settings.sponsorBlock) packSponsor();
  });
});

function runDislikeFeature() {
  chrome.storage.sync.get(["returnDislikes"], (result) => {
    if (!result.returnDislikes) return;

    const videoId = getVideoId(window.location.href);
    if (!videoId || videoId === currentVideoId) return;

    currentVideoId = videoId;
    console.log("Dislike feature enabled for video:", videoId);

    fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`)
      .then((res) => res.json())
      .then((data) => {
        const dislikes = data.dislikes;
        if (!dislikes) return;

        const interval = setInterval(() => {
          const button = document.querySelector("dislike-button-view-model");

          if (button) {
            clearInterval(interval);

            const wrapper = document.createElement("div");
            wrapper.style.display = "flex";
            wrapper.style.alignItems = "center";
            wrapper.style.justifyContent = "center";
            wrapper.style.gap = "4px";
            wrapper.style.color = "var(--yt-spec-text-primary)";
            wrapper.style.fontSize = "14px";
            wrapper.style.height = "100%";
            wrapper.style.width = "100%";
            wrapper.style.borderRadius = "0% 20% 20% 0%";
            wrapper.style.background = "rgba(255, 255, 255, 0.1)";

            const icon = document.createElement("img");
            icon.src = chrome.runtime.getURL("dislikesV1.svg");
            icon.style.width = "24px";
            icon.style.height = "24px";

            const text = document.createElement("span");
            text.textContent = formatNumber(dislikes);

            wrapper.appendChild(icon);
            wrapper.appendChild(text);

            button.appendChild(wrapper);

            button.innerHTML = "";
            button.appendChild(wrapper);
          }
        }, 1000);
      });
  });
}

const getVideoId = (url: string) => {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get("v");
  } catch {
    return null;
  }
};

const formatNumber = (num: number) => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
};

// need refactoring
async function fetchSponsorBlock(videoId: string) {
  const categories = ["sponsor", "selfpromo", "interaction", "intro", "outro"];
  const url = `https://sponsor.ajay.app/api/skipSegments?videoID=${videoId}&categories=${JSON.stringify(
    categories
  )}`;

  const response = await fetch(url);
  if (!response.ok) return [];

  return await response.json();
}

function skipSponsor(player: HTMLVideoElement, segments: [number, number][]) {
  setInterval(() => {
    const currentTime = player.currentTime;

    for (const [start, end] of segments) {
      if (currentTime >= start && currentTime < end) {
        (player.currentTime = end + 0), 1;
        break;
      }
    }
  }, 500);
}

async function packSponsor() {
  const videoId = getVideoId(location.href);
  if (!videoId) return;

  const segmentsData = await fetchSponsorBlock(videoId);
  const segments = segmentsData.map((seg: any) => seg.segment);

  const checkInterval = setInterval(() => {
    const player = document.querySelector("video") as HTMLVideoElement;
    if (player) {
      clearInterval(checkInterval);
      skipSponsor(player, segments);
    }
  }, 1000);
}

const updatedSponsor = () => {
  chrome.storage.sync.get(["sponsorBlock"], (result) => {
    if (!result.sponsorBlock) return;

    packSponsor();
  });
};

setTimeout(() => {
  runDislikeFeature();
  updatedSponsor();
}, 1000);
