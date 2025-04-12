import { Poup } from "./components/poup/Poup";
import { Routes, Route } from "react-router";
import Settings from "./components/settings/Settings";

export const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Poup />} />

        <Route path="/settings" element={<Settings />} />
      </Routes>
    </>
  );
};
