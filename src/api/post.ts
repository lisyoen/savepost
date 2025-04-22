import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // 추가
import { promises as fsPromises } from 'fs';

// __dirname 대체 코드
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.resolve(__dirname, '../../data'); // 상대 경로로 변경
const dataFile = path.join(dataDir, 'posts.json');

// Ensure the data directory and file exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(dataFile)) {
  try {
    fs.writeFileSync(dataFile, JSON.stringify([]), 'utf-8');
    console.log('Initialized posts.json with empty array.');
  } catch (error) {
    console.error('Error initializing posts.json:', (error as Error).message);
  }
}

const saveFilePath = path.join(dataDir, 'posts.json');

export async function savePost(data: Record<string, any>): Promise<any> {
  try {
    let existingData: Record<string, any>[] = [];
    try {
      const fileContent = await fsPromises.readFile(saveFilePath, 'utf-8');
      existingData = JSON.parse(fileContent);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
        console.error('Error reading posts.json:', (err as Error).message);
        throw err;
      }
    }

    const newEntry = { id: existingData.length + 1, ...data, createdAt: new Date().toISOString() };
    existingData.push(newEntry);

    await fsPromises.writeFile(saveFilePath, JSON.stringify(existingData, null, 2), 'utf-8');

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