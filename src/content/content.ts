chrome.storage.sync.get(["returnDislikes"], (result) => {
  if (!result.returnDislikes) return;

  const videoId = getVideoId(window.location.href);

  if (!videoId) return;

  fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`)
    .then((res) => res.json())
    .then((data) => {
      const dislikes = data.dislikes;
      if (!dislikes) return;

      const interval = setInterval(() => {
        const buttons = document.querySelectorAll(
          "yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-button yt-spec-button-shape-next--segmented-end yt-spec-button-shape-next--enable-backdrop-filter-experiment"
        );
        const dislikeButton = buttons[1];

        if (dislikeButton) {
          const textElement = dislikeButton.querySelector(
            "yt-formatted-string"
          );
          if (textElement) {
            textElement.textContent = formatNumber(dislikes);
            clearInterval(interval);
          }
        }
      });
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
