import { useNavigate } from "react-router";

export const Poup = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center px-4 py-3 gap-10">
      <img
        onClick={() => navigate("/settings")}
        className="cursor-pointer"
        src="/settings.svg"
      />
      <img className="w-70" src="/logo.png" />
      <img src="/close.svg" />
    </div>
  );
};
