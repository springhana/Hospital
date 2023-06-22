import axios from "axios";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../style/Home.module.css";

export default function Home() {
  const getDoctor = async () => {
    const url = `/api/doctor/doctor_getAll`;
    try {
      const response = await axios.get(url);
      if (response.data.length === 0) {
        postDoctor();
        console.log("postDoctor 실행");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const postDoctor = async () => {
    try {
      const response = await axios.post(`/api/doctor/doctorPost`);
      console.log("Response: ", response.data);
    } catch (error: any) {
      console.log("Error: ", error);
    }
  };

  const getNurse = async () => {
    const url = `/api/nurse/nurse_getAll`;
    try {
      const response = await axios.get(url);
      if (response.data.length === 0) {
        postNurse();
        console.log("postNurse 실행");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const postNurse = async () => {
    try {
      const response = await axios.post(`/api/nurse/nursePost`);
      console.log("Response: ", response.data);
    } catch (error: any) {
      console.log("Error: ", error);
    }
  };

  useEffect(() => {
    getDoctor();
    getNurse();
  }, []);

  return (
    <div className={styles.home}>
      <Link to="/signPatient" className={styles.home_Link}>
        진료 신청
      </Link>
    </div>
  );
}
