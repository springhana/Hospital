import axios from "axios";
import { useEffect, useState } from "react";
import styles from "../style/NurseInfo.module.css";
import { Chart, Nurse } from "../DataType";

export default function NurseInfo() {
  const [id, setId] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [nurse, setNurse] = useState<Nurse[]>([]);
  const [chart, setChart] = useState<Chart[]>([]);
  const [check, setCheck] = useState<boolean>(true);
  useEffect(() => {
    const storedDoctor = localStorage.getItem("nurse");
    const storedDiagnosis = localStorage.getItem("chart_nur");
    if (storedDoctor && storedDiagnosis) {
      setNurse(JSON.parse(storedDoctor));
      setChart(JSON.parse(storedDiagnosis));
    }
  }, []);

  const saveNurseToStorage = (userData: Nurse) => {
    localStorage.setItem("nurse", JSON.stringify(userData)); // 또는 sessionStorage.setItem("user", JSON.stringify(userData));
  };

  const saveChartToStorage = (userData: Chart) => {
    localStorage.setItem("chart_nur", JSON.stringify(userData)); // 또는 sessionStorage.setItem("user", JSON.stringify(userData));
  };

  const clearDoctor = () => {
    setNurse([]);
    setChart([]);
    localStorage.removeItem("nurse"); // 또는 sessionStorage.removeItem("user");
    localStorage.removeItem("chart_nur"); // 또는 sessionStorage.removeItem("user");
  };

  const getNurseOne = async () => {
    try {
      const response = await axios.get(`/api/nurse/nurseOne`, {
        params: {
          name: name,
          number: id,
        },
      });
      const data = response.data;
      setNurse(data);

      if (data.length > 0) {
        const nurseId = data[0].nurseNumber;
        getChartOne(nurseId);
      }

      saveNurseToStorage(data);
    } catch (error) {
      console.error(error);
      alert("등록된 간호사가 없습니다.");
    }
  };

  const doctorLogin = (e: any) => {
    e.preventDefault();
    getNurseOne();
  };

  const getChartOne = async (nurseId: number) => {
    try {
      const response = await axios.get(`/api/chart/chartOne`, {
        params: {
          number: nurseId,
        },
      });
      const data = response.data;

      setChart(data);
      saveChartToStorage(data);
      setCheck(true);
    } catch (error) {
      console.error(error);
    }
  };

  const ChartCheck = (e: any) => {
    e.preventDefault();
    setCheck(false);
  };

  return (
    <div className={styles.nurse_PostInfo}>
      {nurse.length === 0 ? (
        <div>
          <form onSubmit={doctorLogin} className={styles.nurse_Post}>
            <div className={styles.nurse_input}>
              <span>간호사 ID </span>
              <input
                type="text"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setId(parseInt(e.target.value));
                }}
              />
            </div>
            <div className={styles.nurse_input}>
              <span>이름 </span>
              <input
                type="text"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setName(e.target.value);
                }}
              />
            </div>
            <input type="submit" className={styles.nurse_btn} />
          </form>
        </div>
      ) : (
        <div className={styles.nur_chr_Info}>
          <div>
            {nurse.map((nurse: Nurse) => (
              <div key={nurse.nurseNumber} className={styles.nurse_Info}>
                <div className={styles.nurse}>
                  <span>간호사 ID : {nurse.nurseNumber}</span>
                </div>
                <div className={styles.nurse}>
                  <span>이름 : {nurse.nurseName}</span>
                </div>
                <div className={styles.nurse}>
                  <span>전화번호 : {nurse.tel}</span>
                </div>
                <div className={styles.nurse}>
                  <span>직무 : {nurse.functions}</span>
                </div>
              </div>
            ))}
          </div>

          {check ? (
            <div>
              <button onClick={ChartCheck} className={styles.init}>
                진료 보기
              </button>
            </div>
          ) : (
            <div className={styles.chart_info}>
              <div className={styles.chart_inner}>
                {chart.map((chart: Chart) => {
                  return (
                    <div key={chart.chartNum}>
                      <div className={styles.chart}>
                        <span>차트 아이디 : </span>
                        {chart.chartNum}
                      </div>
                      <div className={styles.chart}>
                        <span>진료 내용 : </span>
                        {chart.chartContent}
                      </div>
                      <div className={styles.chart}>
                        <span>환자 이름 : </span>
                        {chart.diagnosis.patient.patientName}
                      </div>
                      <div className={styles.chart}>
                        <span>환자 전화번호: </span>
                        {chart.diagnosis.patient.tel}
                      </div>
                      <div className={styles.chart}>
                        <span>진료 번호 : </span>
                        {chart.diagnosis.diagnosisNum}
                      </div>
                      <hr />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div>
            <button onClick={clearDoctor} className={styles.init}>
              초기화
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
