import { getVideoId } from "../model";

export async function packSponsor() {
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

export async function fetchSponsorBlock(videoId: string) {
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
