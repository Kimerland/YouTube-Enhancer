export const getVideoId = (url: string) => {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get("v");
  } catch {
    return null;
  }
};
