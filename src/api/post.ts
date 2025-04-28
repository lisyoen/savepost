import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';

// __dirname 대체 코드 제거
const dataDir = path.join(process.cwd(), 'data');
const dataFile = path.join(dataDir, 'posts.jsonl'); // 파일 확장자 변경
// Ensure the data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 시작 로그 출력
console.log(`Starting server at ${new Date().toLocaleTimeString()}`); // 시간만 출력

export async function savePost(data: Record<string, any>): Promise<any> {
  try {
    const newEntry = { id: Date.now(), ...data, createdAt: new Date().toISOString() };

    // JSON 로그를 한 줄씩 추가
    await fsPromises.appendFile(dataFile, JSON.stringify(newEntry) + '\n', 'utf-8');

    console.log('Saved at:', new Date().toLocaleTimeString()); // 시간만 출력

    return { success: true, id: newEntry.id };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error saving post to file:', error.message);
    } else {
      console.error('Error saving post to file:', error);
    }
    throw error;
  }
}
