import { promises as fs } from 'fs';
import * as path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename: string = fileURLToPath(import.meta.url);
const __dirname = __dirname || dirname(__filename);

console.log(__filename); // 현재 파일의 절대 경로
console.log(__dirname);  // 현재 파일이 위치한 디렉토리

const saveFilePath = path.join(__dirname, '../../data/posts.json');

export async function savePost(data: Record<string, any>): Promise<any> {
  try {
    // 기존 파일 읽기
    let existingData: Record<string, any>[] = [];
    try {
      const fileContent = await fs.readFile(saveFilePath, 'utf-8');
      existingData = JSON.parse(fileContent);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw err; // 파일이 없을 때를 제외한 오류는 다시 던짐
      }
    }

    // 새로운 데이터 추가
    const newEntry = { id: existingData.length + 1, ...data, createdAt: new Date().toISOString() };
    existingData.push(newEntry);

    // 파일에 저장
    await fs.writeFile(saveFilePath, JSON.stringify(existingData, null, 2), 'utf-8');

    return { success: true, id: newEntry.id };
  } catch (error) {
    console.error('Error saving post to file:', error);
    throw error;
  }
}

const initialData = [
  {
    "id": 1,
    "key": "value",
    "message": "Hello, JSON!",
    "createdAt": "2025-03-21T12:00:00.000Z"
  }
];

fs.writeFile(saveFilePath, JSON.stringify(initialData, null, 2), 'utf-8')
  .then(() => console.log('Initial data written to file'))
  .catch((error: NodeJS.ErrnoException) => {
    console.error('Error writing initial data to file:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
  });
