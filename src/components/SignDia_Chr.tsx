import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../style/SignDia_Chr.module.css";
import {
  Chart,
  ChartPostType,
  Diagnosis,
  DiagnosisPostType,
} from "../DataType";

export default function Dia_Chr() {
  const navigate = useNavigate();
  const [content, setCotent] = useState<string>("");
  const [chart_con, setChart_con] = useState<string>("");
  const [suscess, setSuscess] = useState<boolean>(false);

  const [diagnosis, setDiagnosis] = useState<Diagnosis[]>([]);
  const [chart, setChart] = useState<Chart[]>([]);
  const [dia_Num, setDia_Num] = useState<number>(200000);
  const [chr_Num, setChr_Num] = useState<number>(300000);

  // 중복 체크
  const DiagnosisNumber = async () => {
    diagnosis.map((diagnosis: Diagnosis) => {
      if (dia_Num === diagnosis.diagnosisNum) {
        // console.log(dia_Num);
        // console.log("중복");
        let newNum = dia_Num + 1;
        setDia_Num(newNum);
      } else if (dia_Num !== diagnosis.diagnosisNum) {
        // console.log("중복 아님");
        // console.log(dia_Num);
      }
    });
  };
  DiagnosisNumber();
  // 중복 체크
  const ChartNumber = async () => {
    chart.map((chart: Chart) => {
      if (chr_Num === chart.chartNum) {
        // console.log("중복");
        let newNum = chr_Num + 1;
        setChr_Num(newNum);
      } else if (chr_Num !== chart.chartNum) {
        // console.log("중복 아님");
        // console.log(chr_Num);
      }
    });
  };
  ChartNumber();

  const postDiagnosis = async () => {
    const diagnosis: DiagnosisPostType = {
      diagnosisNum: dia_Num,
      diagnosisContent: content,
    };
    console.log(diagnosis);
    try {
      const response = await axios.post(`/api/sign/DiagnosisSave`, diagnosis);
      console.log("Response: ", response.data);
      postChart();
    } catch (error: any) {
      console.log("Error: ", error);
    }
  };

  const postChart = async () => {
    const chart: ChartPostType = {
      chartNum: chr_Num,
      chartContent: chart_con,
    };
    console.log(chart);
    try {
      const response = await axios.post(`/api/sign/ChartSave`, chart);
      console.log("Response: ", response.data);
      setSuscess(true);
    } catch (error: any) {
      console.log("Error: ", error);
    }
  };

  const getDiagnosis = async () => {
    const url = `/api/diagnosis/diagnosis_getAll`;
    try {
      const response = await axios.get(url);
      //   console.log("# 응답객체 : ", response.data);
      setDiagnosis(response.data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const getChart = async () => {
    const url = `/api/chart/chart_getAll`;
    try {
      const response = await axios.get(url);
      //   console.log("# 응답객체 : ", response.data);
      setChart(response.data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    getDiagnosis();
    getChart();
  }, []);

  return (
    <div>
      {suscess ? (
        <div onClick={() => navigate("/")} className={styles.first}>
          처음으로
        </div>
      ) : (
        <div className={styles.doctor_Post}>
          <div className={styles.doctor_input}>
            <span>증상 : </span>
            <input
              type="text"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCotent(e.target.value)
              }
            />
          </div>

          <div className={styles.doctor_input}>
            <span>처방 : </span>
            <input
              type="text"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setChart_con(e.target.value)
              }
            />
          </div>

          <div
            onClick={() => {
              postDiagnosis();
            }}
            className={styles.init}
          >
            진료 신청
          </div>
        </div>
      )}
    </div>
  );
}
