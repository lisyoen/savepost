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
    const { filepath, offset, data: base64Data } = data;

    if (!filepath || typeof offset !== 'number' || !base64Data) {
      throw new Error('Invalid input: filepath, offset, and data are required.');
    }

    const fullFilePath = path.join(dataDir, filepath);

    // Ensure the directory for the file exists
    const fileDir = path.dirname(fullFilePath);
    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir, { recursive: true });
    }

    // Decode Base64 data
    const binaryData = Buffer.from(base64Data, 'base64');

    // Write binary data to the file at the specified offset
    const fileHandle = await fsPromises.open(fullFilePath, 'a+');
    try {
      await fileHandle.write(binaryData, 0, binaryData.length, offset);
    } finally {
      await fileHandle.close();
    }

    // Log the operation in the JSONL file
    const newEntry = {
      id: Date.now(),
      filepath,
      offset,
      createdAt: new Date().toISOString(),
    };
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
