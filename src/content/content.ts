import { toogleTheme } from "../features/darkTheme";
import { runDislikeFeature } from "../features/dislikeFeature";
import { packSponsor } from "../features/sponsorBlock";
import { observeUrlChange } from "../lib";

console.log("Content script loaded");

chrome.storage.sync.get(["returnDislikes"], (data) => {
  if (data.returnDislikes === undefined) {
    chrome.storage.sync.set({ returnDislikes: true });
  }
});

observeUrlChange(() => {
  chrome.storage.sync.get(
    ["returnDislikes", "sponsorBlock", "darkTheme"],
    (settings) => {
      if (settings.returnDislikes) runDislikeFeature();
      if (settings.sponsorBlock) packSponsor();
      if (settings.darkTheme) toogleTheme();
    }
  );
});

setTimeout(() => {
  chrome.storage.sync.get(
    ["returnDislikes", "sponsorBlock", "darkTheme"],
    (settings) => {
      if (settings.returnDislikes) runDislikeFeature();
      if (settings.sponsorBlock) packSponsor();
      if (settings.darkTheme) toogleTheme();
    }
  );
}, 1000);
