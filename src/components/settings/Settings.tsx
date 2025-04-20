import { useEffect, useState } from "react";

const Settings = () => {
  const [settings, setSettings] = useState({
    returnDislikes: true,
    sponsorBlock: true,
    darkTheme: true,
  });

  useEffect(() => {
    chrome.storage.sync.get(
      ["returnDislikes", "sponsorBlock", "darkTheme"],
      (data) => {
        setSettings({
          returnDislikes: data.returnDislikes ?? true,
          sponsorBlock: data.sponsorBlock ?? true,
          darkTheme: data.darkTheme ?? true,
        });

        if (data.returnDislikes === undefined) {
          chrome.storage.sync.set({ returnDislikes: true });
        }
        if (data.sponsorBlock === undefined) {
          chrome.storage.sync.set({ sponsorBlock: true });
        }
        if (data.darkTheme === undefined) {
          chrome.storage.sync.set({ darkTheme: true });
        }
      }
    );
  }, []);

  const toogleSettings = (key: keyof typeof settings) => {
    const newValue = !settings[key];
    setSettings((prev) => ({ ...prev, [key]: newValue }));
    chrome.storage.sync.set({ [key]: newValue });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="flex items-center justify-between gap-5">
        <p>Return Dislikes</p>
        <input
          type="checkbox"
          checked={settings.returnDislikes}
          onChange={() => toogleSettings("returnDislikes")}
        />
      </div>

      <div className="flex items-center justify-between">
        <p>SponsorBlock</p>
        <input
          type="checkbox"
          checked={settings.sponsorBlock}
          onChange={() => toogleSettings("sponsorBlock")}
        />
      </div>

      <div className="flex items-center justify-between">
        <p>Dark theme</p>
        <input
          type="checkbox"
          checked={settings.darkTheme}
          onChange={() => toogleSettings("darkTheme")}
        />
      </div>
    </div>
  );
};

export default Settings;
