import "./SVG/Background.css";
import DesignedButton from "./component/DesignedButton";
import ConfirmNumber from "./component/ConfirmNumber";
import MinionInfo from "./component/MinionInfo";
import MinionStrategy from "./component/MinionStrategy";
import ConfigurationFile from "./component/ConfigurationFile";
import Board from "./component/Board";
import { BrowserRouter as Router, Routes, Route , useNavigate} from "react-router-dom";

const Home = () => {
  const navigate = useNavigate(); // ใช้สำหรับสั่งย้ายหน้า

  return (
    <div className="start-Background medieval-Sharp">
      <DesignedButton
        top={409} 
        left={732}
        onClick={() => navigate("/confirm")} // 2. สั่งให้ไปหน้ายืนยัน
      >
        Solitaire
      </DesignedButton>
      
      <DesignedButton
        top={590} 
        left={732}
        onClick={() => navigate("/confirm")}
      >
        Duel
      </DesignedButton>

      <DesignedButton
        top={771} 
        left={732}
        onClick={() => navigate("/confirm")}
      >
        Auto
      </DesignedButton>
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
        <Route path="/strategy" element={<MinionStrategy/>} />
        <Route path="/config" element={<ConfigurationFile/>} />
        <Route path="/board" element={<Board/>} />
      </Routes>
    </Router>
  );
}

export default App;
