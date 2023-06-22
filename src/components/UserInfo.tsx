import axios from "axios";
import { useEffect, useState } from "react";
import styles from "../style/UserInfo.module.css";
import WebConfig from "./WebConfig";
import { Diagnosis, Patient } from "../DataType";

export default function UserInfo() {
  const [name, setName] = useState<string>("");
  const [tel, setTel] = useState<string>("");
  const [user, setUser] = useState<Patient[]>([]);
  const [diagnosis, setDiagnosis] = useState<Diagnosis[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedDiagnosis = localStorage.getItem("diagnosis");
    if (storedUser && storedDiagnosis) {
      setUser(JSON.parse(storedUser));
      setDiagnosis(JSON.parse(storedDiagnosis));
    }
  }, []);

  const saveUserToStorage = (userData: Patient) => {
    localStorage.setItem("user", JSON.stringify(userData)); // 또는 sessionStorage.setItem("user", JSON.stringify(userData));
  };

  const saveDiagnosisToStorage = (userData: Diagnosis) => {
    localStorage.setItem("diagnosis", JSON.stringify(userData)); // 또는 sessionStorage.setItem("user", JSON.stringify(userData));
  };

  const clearUser = () => {
    setUser([]);
    setDiagnosis([]);
    localStorage.removeItem("user"); // 또는 sessionStorage.removeItem("user");
    localStorage.removeItem("diagnosis"); // 또는 sessionStorage.removeItem("user");
  };

  const getPatient = async () => {
    try {
      const response = await axios.get(`/api/Patient/patientOne`, {
        params: {
          name: name,
          tel: tel,
        },
      });
      const data = response.data;
      console.log(data);
      setUser(data);
      saveUserToStorage(data);
      const pat_num = data[0].patientNum;
      getDiagnosisOne_patientId(pat_num);
    } catch (error) {
      console.error(error);
      alert("등록된 정보가 없습니다.");
    }
  };

  const getDiagnosisOne_patientId = async (pat_num: number) => {
    try {
      const response = await axios.get(
        `/api/diagnosis/diagnosisOne_patientId`,
        {
          params: {
            number: pat_num,
          },
        }
      );
      const data = response.data;
      console.log(data);
      setDiagnosis(data);
      saveDiagnosisToStorage(data);
    } catch (error) {
      console.error(error);
    }
  };

  const onUserSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getPatient();
  };

  const cancel = (diagnosisNum: number) => {
    console.log(diagnosisNum);
    deleteChart(diagnosisNum);
  };

  function deleteDiagnosis(diagnosisNum: number) {
    const queryParams = new URLSearchParams();
    queryParams.append("number", diagnosisNum.toString());

    const url = "/api/diagnosis?" + queryParams.toString();

    fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log("진단 정보가 성공적으로 삭제되었습니다.");
        } else {
          console.error("오류 발생:", response.status);
        }
      })
      .catch((error) => {
        console.error("네트워크 오류:", error);
      });
  }

  function deleteChart(diagnosisNum: number) {
    const queryParams = new URLSearchParams();
    queryParams.append("number", diagnosisNum.toString());

    const url = "/api/chart?" + queryParams.toString();

    fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          deleteDiagnosis(diagnosisNum);
          getPatient();
          console.log("진단 정보가 성공적으로 삭제되었습니다.");
        } else {
          console.error("오류 발생:", response.status);
        }
      })
      .catch((error) => {
        console.error("네트워크 오류:", error);
      });
  }

  return (
    <div className={styles.user_Info}>
      {user.length === 0 ? (
        <div>
          <form onSubmit={onUserSearch} className={styles.user_Post}>
            <div className={styles.user_input}>
              <span>이름 </span>
              <input
                type="text"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setName(e.target.value);
                }}
              />
            </div>
            <div className={styles.user_input}>
              <span>전화번호 </span>
              <input
                type="text"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setTel(e.target.value);
                }}
              />
            </div>
            <input type="submit" value="찾기" className={styles.user_btn} />
          </form>
        </div>
      ) : (
        <div className={styles.user_pat_dia_info}>
          <div>
            {user.map((user: Patient) => (
              <div key={user.patientNum} className={styles.user_patient_info}>
                <div className={styles.user_patient}>
                  <span>번호 : {user.patientNum}</span>
                </div>
                <div className={styles.user_patient}>
                  <span>이름 : {user.patientName}</span>
                </div>
                <div className={styles.user_patient}>
                  <span>전화번호 : {user.tel}</span>
                </div>

                <WebConfig image={user.image} />
              </div>
            ))}
          </div>
          {diagnosis.length === 0 ? null : (
            <div className={styles.user_diagnosis_info}>
              {diagnosis.map((diagnosis: Diagnosis, index: number) => (
                <div key={index}>
                  <div className={styles.user_diagnosis}>
                    <span>진료 번호 : {diagnosis.diagnosisNum}</span>
                  </div>
                  <div className={styles.user_diagnosis}>
                    <span>진료 내용 : {diagnosis.diagnosisContent}</span>
                  </div>
                  <div className={styles.user_diagnosis}>
                    <span>의사 : {diagnosis.doctor.doctorName}</span>
                  </div>
                  <div className={styles.user_diagnosis}>
                    <span>의사 전화번호 : {diagnosis.doctor.tel}</span>
                  </div>
                  <div className={styles.user_diagnosis}>
                    <span>분류 : {diagnosis.doctor.fieldOfMedicine}</span>
                  </div>
                  <div className={styles.user_diagnosis}>
                    <span>진료 날짜 : {diagnosis.diagnosisDate}</span>
                  </div>
                  {diagnosis ? (
                    <div>
                      <button
                        onClick={() => cancel(diagnosis.diagnosisNum)}
                        className={styles.cancelBtn}
                      >
                        취소하기
                      </button>
                    </div>
                  ) : null}
                  <hr />
                </div>
              ))}
            </div>
          )}

          <div>
            <button onClick={clearUser} className={styles.init}>
              초기화
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
