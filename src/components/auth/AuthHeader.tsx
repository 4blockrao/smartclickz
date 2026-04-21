
import { TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AuthHeader() {
  const navigate = useNavigate();
  return (
    <header className="flex items-center justify-center gap-3 pt-8 pb-6 select-none cursor-pointer" onClick={() => navigate("/")}>
      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
        <TrendingUp className="text-white w-6 h-6" />
      </div>
      <span className="font-bold text-3xl text-gray-900 tracking-tight">
        socioAI
      </span>
    </header>
  );
}
