
import DesignedButton from "./component/DesignedButton";
import ConfirmNumber from "./component/ConfirmNumber";
import MinionInfo from "./component/MinionInfo";
import MinionStrategy from "./component/MinionStrategy";
import ConfigurationFile from "./component/ConfigurationFile";
import Board from "./component/Board";
import WinnerPage from "./component/WinnerPage";
import StartSVG from "./SVG/Start.svg";
import { API } from "./api";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

type Mode = "Solitaire" | "Duel" | "Auto";

const Home = () => {
  const navigate = useNavigate();

  const handleSelectMode = async (mode: Mode) => {
    try {
      // เรียกใช้ API ส่งแค่ mode ไป
      const response = await API.createModeSelection({ mode });
      console.log("Response from server (GameID & Mode):", response);
      const gameID = (response as { gameID?: string })?.gameID;

      if (!gameID) {
        console.error("Backend did not return gameID; cannot start game session.");
        return;
      }

      // ส่ง mode + gameID ที่ได้จาก backend ไปหน้า ConfirmNumber
      navigate("/confirm", {
        state: {
          mode,
          gameID,
        },
      });
    } catch (error) {
      console.error("Error creating mode selection:", error);
    }
  };

  return (
    <div className="medieval-Sharp fs-96">
      <div>
        <img
          src={StartSVG}
          alt="Background"
        />
      
        <DesignedButton
          top={409}
          left={710}
          className="mode-button"
          onClick={() => handleSelectMode("Solitaire")}
        >
          Solitaire
        </DesignedButton>

        <DesignedButton
          top={590}
          left={710}
          className="mode-button"
          onClick={() => handleSelectMode("Duel")}
        >
          Duel
        </DesignedButton>

        <DesignedButton
          top={771}
          left={710}
          className="mode-button"
          onClick={() => handleSelectMode("Auto")}
        >
          Auto
        </DesignedButton>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/confirm" element={<ConfirmNumber />} />
        <Route path="/minions" element={<MinionInfo />} />
        <Route path="/strategy" element={<MinionStrategy />} />
        <Route path="/config" element={<ConfigurationFile />} />
        <Route path="/board" element={<Board />} />
        <Route path="/winner" element={<WinnerPage />} />
      </Routes>
    </Router>
  );
}

export default App;
