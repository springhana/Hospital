const express = require("express");
const app = express();
const path = require("path");

// 정적 파일 제공을 위한 미들웨어 설정
app.use(express.static(path.join(__dirname, "public")));

// 이미지에 대한 요청을 처리하는 라우트 설정
app.get("/images/:filename", (req, res) => {
  const filename = req.params.filename;
  res.sendFile(path.join(__dirname, "public/images", filename));
});

// 서버 시작
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
