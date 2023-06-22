import React from "react";
const WebMvcConfig = ({ image }: any) => {
  return (
    <div
      style={{
        position: "relative",
        borderLeft: "2px solid #92CBDC",
        background: "#FFF",
        width: "100px",
        height: "100px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Express 웹 서버에서 이미지를 로드 */}
      <img
        src={`http://localhost:8080${image}`}
        alt="Image"
        style={{ width: "80px", height: "100px" }}
      />
    </div>
  );
};

export default WebMvcConfig;
