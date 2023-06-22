import { Routes, Route, Link, useLocation } from "react-router-dom";
import UserInfo from "./UserInfo";
import DoctorInfo from "./DoctorInfo";
import NurseInfo from "./NurseInfo";
import Home from "./Home";
import SignDia_Chr from "./SignDia_Chr";
import SignPatient from "./SignPatient";
import styles from "../style/NavBar.module.css";

export default function NavBar() {
  const location = useLocation();
  const currentUrl = location.pathname;

  const urlColor = (url: any) => {
    if (currentUrl === url) {
      return {
        color: "aqua",
        background: "#f9d066",
        borderBottomColor: "#fcd364",
      };
    } else {
      return { color: "black" };
    }
  };

  return (
    <div>
      <div className={styles.NavBar_inner}>
        <Link
          to="/userInfo"
          className={styles.NavBar_Link}
          style={urlColor("/userInfo")}
        >
          <span>자기 정보 보기</span>
        </Link>

        <Link
          to="/doctorInfo"
          className={styles.NavBar_Link}
          style={urlColor("/doctorInfo")}
        >
          <span>의사</span>
        </Link>

        <Link
          to="/nurseInfo"
          className={styles.NavBar_Link}
          style={urlColor("/nurseInfo")}
        >
          <span>간호사</span>
        </Link>

        <Link to="/" className={styles.NavBar_Link} style={urlColor("/")}>
          <span>진료 신청</span>
        </Link>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/userInfo" element={<UserInfo />} />
        <Route path="/doctorInfo" element={<DoctorInfo />} />
        <Route path="/nurseInfo" element={<NurseInfo />} />
        <Route path="/signPatient" element={<SignPatient />} />
        <Route path="/signDia_Chr" element={<SignDia_Chr />} />
      </Routes>
    </div>
  );
}
