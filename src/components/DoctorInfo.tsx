import axios from "axios";
import { useEffect, useState } from "react";
import styles from "../style/DoctorInfo.module.css";
import { Diagnosis, Doctor } from "../DataType";

export default function DoctorInfo() {
  const [id, setId] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [doctor, setDoctor] = useState<Doctor[]>([]);
  const [diagnosis, setDiagnosis] = useState<Diagnosis[]>([]);
  const [check, setCheck] = useState<boolean>(true);
  useEffect(() => {
    const storedDoctor = localStorage.getItem("doctor");
    const storedDiagnosis = localStorage.getItem("diagnosis_doc");
    if (storedDoctor && storedDiagnosis) {
      setDoctor(JSON.parse(storedDoctor));
      setDiagnosis(JSON.parse(storedDiagnosis));
    }
  }, []);

  const saveDoctorToStorage = (userData: Doctor) => {
    localStorage.setItem("doctor", JSON.stringify(userData)); // 또는 sessionStorage.setItem("user", JSON.stringify(userData));
  };

  const saveDiagnosisToStorage = (userData: Diagnosis) => {
    localStorage.setItem("diagnosis_doc", JSON.stringify(userData)); // 또는 sessionStorage.setItem("user", JSON.stringify(userData));
  };

  const clearDoctor = () => {
    setDoctor([]);
    setDiagnosis([]);
    localStorage.removeItem("doctor"); // 또는 sessionStorage.removeItem("user");
    localStorage.removeItem("diagnosis_doc"); // 또는 sessionStorage.removeItem("user");
  };

  const getDiagnosisOne_patientId = async () => {
    try {
      const response = await axios.get(`/api/doctor/doctorOne`, {
        params: {
          name: name,
          number: id,
        },
      });
      const data = response.data;
      setDoctor(data);

      if (data.length > 0) {
        const doctorId = data[0].doctorId;
        getDiagnosisOne_doctorId(doctorId);
      }

      saveDoctorToStorage(data);
    } catch (error) {
      alert("등록된 의사가 없습니다.");
      console.error(error);
    }
  };

  const doctorLogin = (e: any) => {
    e.preventDefault();
    getDiagnosisOne_patientId();
  };

  const getDiagnosisOne_doctorId = async (doctorId: number) => {
    try {
      const response = await axios.get(`/api/diagnosis/diagnosisOne_doctorId`, {
        params: {
          number: doctorId,
        },
      });
      const data = response.data;

      setDiagnosis(data);
      saveDiagnosisToStorage(data);
      setCheck(true);
    } catch (error) {
      console.error(error);
    }
  };

  const diagnosisCheck = (e: any) => {
    e.preventDefault();
    setCheck(false);
  };

  return (
    <div className={styles.doctor_PostInfo}>
      {doctor.length === 0 ? (
        <div>
          <form onSubmit={doctorLogin} className={styles.doctor_Post}>
            <div className={styles.doctor_input}>
              <span>의사 ID : </span>
              <input
                type="text"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setId(parseInt(e.target.value));
                }}
              />
            </div>
            <div className={styles.doctor_input}>
              <span>이름 : </span>
              <input
                type="text"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setName(e.target.value);
                }}
              />
            </div>
            <input type="submit" className={styles.doctor_btn} />
          </form>
        </div>
      ) : (
        <div className={styles.doc_dia_Info}>
          <div>
            {doctor.map((doctor: Doctor) => (
              <div key={doctor.doctorId} className={styles.doctor_Info}>
                <div className={styles.doctor}>
                  <span>의사 ID : {doctor.doctorId}</span>
                </div>
                <div className={styles.doctor}>
                  <span>이름 : {doctor.doctorName}</span>
                </div>
                <div className={styles.doctor}>
                  <span>전화번호 : {doctor.tel}</span>
                </div>
                <div className={styles.doctor}>
                  <span>진료 분야 : {doctor.fieldOfMedicine}</span>
                </div>
              </div>
            ))}
          </div>

          {check ? (
            <div>
              <button onClick={diagnosisCheck} className={styles.init}>
                진료 보기
              </button>
            </div>
          ) : (
            <div className={styles.diagnosis_info}>
              <div className={styles.diagnosis_inner}>
                {diagnosis.map((diagnosis: Diagnosis) => {
                  return (
                    <div key={diagnosis.diagnosisNum}>
                      <div className={styles.diagnosis}>
                        <span>환자 이름 : {diagnosis.patient.patientName}</span>
                        &nbsp;&nbsp;
                        <span>환자 번호 : {diagnosis.patient.patientNum}</span>
                      </div>
                      <div className={styles.diagnosis}>
                        <span>진료 번호 : {diagnosis.diagnosisNum}</span>
                      </div>
                      <div className={styles.diagnosis}>
                        <span>진료 내용 : {diagnosis.diagnosisContent}</span>
                      </div>
                      <div className={styles.diagnosis}>
                        <span>진료 날짜 : {diagnosis.diagnosisDate}</span>
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
