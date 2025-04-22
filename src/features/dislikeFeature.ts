import { formatNumber } from "../lib";
import { getVideoId } from "../model";

let currentVideoId: null | string = null;

export async function runDislikeFeature() {
  const { returnDislikes } = await chrome.storage.sync.get(["returnDislikes"]);
  if (!returnDislikes) return;

  const videoId = getVideoId(location.href);
  if (!videoId || videoId === currentVideoId) return;

  currentVideoId = videoId;

  const res = await fetch(
    `https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`
  );
  const data = await res.json();
  const dislikes = data.dislikes;
  if (!dislikes) return;

  const interval = setInterval(() => {
    const button = document.querySelector("dislike-button-view-model");
    if (button) {
      clearInterval(interval);

      const wrapper = document.createElement("div");
      wrapper.className = "dislike-wrapper";
      wrapper.style.cssText = `
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--yt-spec-text-primary);
          font-size: 14px;
          height: 100%;
          width: 100%;
          border-radius: 0% 20% 20% 0%;
          background: rgba(255, 255, 255, 0.1);
        `;

      const icon = document.createElement("img");
      icon.src = chrome.runtime.getURL("dislikesV1.svg");
      icon.style.width = "24px";
      icon.style.height = "24px";

      const text = document.createElement("span");
      text.textContent = formatNumber(dislikes);

      wrapper.appendChild(icon);
      wrapper.appendChild(text);

      button.innerHTML = "";
      button.appendChild(wrapper);
    }
  }, 1000);
}
