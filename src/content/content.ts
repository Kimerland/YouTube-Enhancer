console.log("Content script loaded");

let currentVideoId: null | string = null;

chrome.storage.sync.get(["returnDislikes"], (data) => {
  if (data.returnDislikes === undefined) {
    chrome.storage.sync.set({ returnDislikes: true }, () => {
      console.log("returnDislikes set to true");
    });
  }
});

let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    setTimeout(() => {
      runDislikeFeature();
    }, 1000);
  }
}).observe(document, { subtree: true, childList: true });

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

runDislikeFeature();

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
