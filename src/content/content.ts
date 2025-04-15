console.log("Content script loaded");

chrome.storage.sync.get(["returnDislikes"], (data) => {
  if (data.returnDislikes === undefined) {
    chrome.storage.sync.set({ returnDislikes: true }, () => {
      console.log("returnDislikes set to true");
    });
  }
});

chrome.storage.sync.get(["returnDislikes"], (result) => {
  console.log("result.returnDislikes");

  if (!result.returnDislikes) return;
  console.log("Dislike feature enabled");

  const videoId = getVideoId(window.location.href);
  if (!videoId) return;

  console.log("Video ID:", videoId);

  fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`)
    .then((res) => res.json())
    .then((data) => {
      const dislikes = data.dislikes;
      if (!dislikes) return;

      const interval = setInterval(() => {
        const button = document.querySelector("dislike-button-view-model");

        if (button) {
          clearInterval(interval);

          button.innerHTML = "";

          // fix styles in the future
          const wrapper = document.createElement("div");
          wrapper.style.display = "flex";
          wrapper.style.alignItems = "center";
          wrapper.style.gap = "6px";
          wrapper.style.color = "var(--yt-spec-text-primary)";
          wrapper.style.fontSize = "14px";

          // replace icon
          const icon = document.createElement("span");
          icon.textContent = "👎";
          icon.style.fontSize = "16px";

          const text = document.createElement("span");
          text.textContent = formatNumber(dislikes);

          wrapper.appendChild(icon);
          wrapper.appendChild(text);

          button.appendChild(wrapper);

          console.log("Dislike count updated with icon");
        }
      }, 1000);
    });
});

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
