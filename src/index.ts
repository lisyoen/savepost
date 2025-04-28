import express from 'express';
import { savePost } from './api/post.js'; // .js 확장자 추가
// import { createRequire } from 'module'; // createRequire 추가

// const require = createRequire(import.meta.url); // CommonJS require 생성
const app = express();
const PORT = 8040;

app.use(express.json());
// 시작 시간 로그 출력
console.log(`Server started at ${new Date().toLocaleTimeString()}`); // 시간만 출력
// 서버가 시작될 때 로그 출력
console.log(`Server is running on port ${PORT}`);

// 기본 라우트 설정
app.post('/savepost', async (req, res) => {
  try {
    const result = await savePost(req.body);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in /savepost route:', error.message); // 에러 로그 추가
    } else {
      console.error('Error in /savepost route:', error); // 에러 로그 추가
    }
    res.status(500).json({ 
      error: 'Failed to save post', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    }); // 상세 메시지 포함
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

