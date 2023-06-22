import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../style/SignPatient.module.css";
import { Doctor, Nurse, Patient, patientPostType } from "../DataType";

export default function Home() {
  const [name, setName] = useState<string>("");
  const [tel, setTel] = useState<string>("");
  const [Doctor, setDoctor] = useState<Doctor[]>([]);
  const [Nurse, setNurse] = useState<Nurse[]>([]);
  const [DoctorId, setDoctorId] = useState<number>(0);
  const [NurseId, setNurseId] = useState<number>(0);

  const [pat_login, setPat_login] = useState<boolean>(false);
  const [user, setUser] = useState<Patient[]>([]);
  const [user_pat_Num, setUser_pat_Num] = useState<number>(0);

  const [patient, setPatient] = useState<Patient[]>([]);
  const [pat_Nums, setPat_Nums] = useState<number>(100000);

  const [image, setImage] = useState<any>([]); // 이미지 파일을 따로 가져오는거라 타입을 모르겠음
  const [selectedImage, setSelectedImage] = useState<string>("");

  const [change, setChange] = useState<boolean>(false);
  const navigate = useNavigate();

  // 중복 체크
  const PatientNumber = async () => {
    patient.map((patient: Patient) => {
      if (pat_Nums === patient.patientNum) {
        // console.log(pat_Nums);
        // console.log(dia_Num);
        // console.log("중복");
        let newNum = pat_Nums + 1;
        setPat_Nums(newNum);
      } else if (pat_Nums !== patient.patientNum) {
        // console.log("중복 아님");
        // console.log(pat_Nums);
        return;
      }
    });
  };

  PatientNumber();

  const getPatient = async () => {
    const url = `/api/Patient/patient_getAll`;
    try {
      const response = await axios.get(url);
      //   console.log("# 응답객체 : ", response.data);
      setPatient(response.data);
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const getDoctor = async () => {
    const url = `/api/doctor/doctor_getAll`;
    try {
      const response = await axios.get(url);
      //   console.log("# 응답객체 : ", response.data);
      setDoctor(response.data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const getNurse = async () => {
    const url = `/api/nurse/nurse_getAll`;
    try {
      const response = await axios.get(url);
      //   console.log("# 응답객체 : ", response.data);
      setNurse(response.data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  function fetchImage() {
    console.log(user ? image : []);

    const formData = new FormData();
    formData.append("filename", image);

    const url = "/api/sign/image";

    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((data) => {
        console.log("data " + data);
        const ImageName = "/images/" + data;
        postSign(ImageName);
      })
      .catch((error) => {
        console.error("Error fetching nurses:", error);
        alert("사진을 등록해주세요");
      });
  }

  const postSign = async (ImageName: string) => {
    const patient: patientPostType = {
      patientNum: user_pat_Num === 0 ? pat_Nums : user_pat_Num,
      patientName: name,
      tel: tel,
      image: user ? ImageName : "",
    };
    console.log(patient);
    try {
      const response = await axios.post(`/api/sign/PatientSave`, patient, {
        params: {
          nurseID: NurseId,
          doctorID: DoctorId,
        },
      });
      console.log("Response: ", response.data);
      navigate("/signDia_Chr");
    } catch (error: any) {
      // error 타입을 모르겠음
      console.log("Error: ", error);
      alert("중복된 번호입니다.");
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    getDoctor();
    getNurse();
    getPatient();
  }, []);

  const saveUserToStorage = (userData: Patient) => {
    localStorage.setItem("user", JSON.stringify(userData)); // 또는 sessionStorage.setItem("user", JSON.stringify(userData));
  };

  const clearUser = () => {
    setUser([]);
    localStorage.removeItem("user"); // 또는 sessionStorage.removeItem("user");
  };

  const getPatientLogin = async () => {
    try {
      const response = await axios.get(`/api/Patient/patientOne`, {
        params: {
          name: name,
          tel: tel,
        },
      });
      const data = response.data;
      console.log(data[0].image);
      setUser_pat_Num(data[0].patientNum);
      setImage(data[0].image);
      setUser(data);
      saveUserToStorage(data);
    } catch (error) {
      console.error(error);
      alert("등록된 정보가 없습니다.");
      navigate("/");
    }
  };
  const login = () => {
    getPatientLogin();
    setPat_login(true);
  };

  const previewFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      {pat_login ? (
        <div>
          {user.length === 0 ? (
            <div className={styles.userSign}>
              <div>
                <div className={styles.userSign_input}>
                  <span>이름 : </span>
                  <input
                    type="text"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setName(e.target.value)
                    }
                  />
                </div>
                <div style={{ height: "50px" }}></div>
                <div className={styles.userSign_input}>
                  <span>전화번호 : </span>
                  <input
                    type="text"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setTel(e.target.value)
                    }
                  />
                </div>
              </div>

              <div className={styles.user_image}>
                <img
                  id="previewImage"
                  src={selectedImage}
                  style={{
                    width: "150px",
                    height: "200px",
                    border: "2px solid #92CBDC",
                  }}
                />
                <div className={styles.image_btn}>
                  <input
                    type="file"
                    name="filename"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (!e.target.files) return;
                      setImage(e.target.files[0]);
                      previewFile(e);
                    }}
                    style={{ width: "150px" }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.user_image}>
              <img
                id="previewImage"
                src={change ? selectedImage : `http://localhost:8080${image}`}
                style={{
                  width: "150px",
                  height: "200px",
                  border: "2px solid #92CBDC",
                }}
              />
              <div className={styles.image_btn}>
                <input
                  type="file"
                  name="filename"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (!e.target.files) return;
                    setImage(e.target.files[0]);
                    previewFile(e);
                    setChange(true);
                  }}
                  style={{ width: "150px" }}
                  defaultValue={selectedImage}
                />
              </div>
            </div>
          )}

          <div className={styles.doc_nur_select}>
            <div className={styles.doc_nur}>
              <span>( 의사 )</span>
              <select
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setDoctorId(parseInt(e.target.value))
                }
                className={styles.doc_nur_option}
              >
                <option>선택해주세요.</option>
                {Doctor.map((doctor: Doctor) => (
                  <option value={doctor.doctorId} key={doctor.doctorId}>
                    {doctor.fieldOfMedicine} : {doctor.doctorName}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.doc_nur}>
              <span>( 간호사 )</span>
              <select
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setNurseId(parseInt(e.target.value));
                }}
                className={styles.doc_nur_option}
              >
                <option>선택해주세요.</option>
                {Nurse.map((nurse: Nurse) => (
                  <option value={nurse.nurseNumber} key={nurse.nurseNumber}>
                    {nurse.functions} : {nurse.nurseName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div onClick={fetchImage} className={styles.init}>
            계속
          </div>
        </div>
      ) : (
        <div>
          <div onSubmit={login} className={styles.user_Post}>
            <div className={styles.user_input}>
              <span>이름 </span>
              <input
                type="text"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
              />
            </div>
            <div className={styles.user_input}>
              <span>전화번호 </span>
              <input
                type="text"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTel(e.target.value)
                }
              />
            </div>
            <div onClick={login} className={styles.user_Login_btn}>
              로그인
            </div>
          </div>
          <div
            onClick={() => {
              setPat_login(true);
              clearUser();
            }}
            className={styles.SignPatient}
          >
            회원가입
          </div>
        </div>
      )}
    </div>
  );
}
