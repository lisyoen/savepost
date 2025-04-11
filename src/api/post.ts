import fs from 'fs';
import path from 'path';
import express from 'express';

const app = express();
app.use(express.json());

const dataDir = path.resolve('C:/git/savepost/data');
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
    console.error('Error initializing posts.json:', error);
  }
}

import { promises as fsPromises } from 'fs';

const saveFilePath = path.join(dataDir, 'posts.json');

export async function savePost(data: Record<string, any>): Promise<any> {
  try {
    let existingData: Record<string, any>[] = [];
    try {
      const fileContent = await fsPromises.readFile(saveFilePath, 'utf-8');
      existingData = JSON.parse(fileContent);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw err;
      }
    }

    const newEntry = { id: existingData.length + 1, ...data, createdAt: new Date().toISOString() };
    existingData.push(newEntry);

    await fsPromises.writeFile(saveFilePath, JSON.stringify(existingData, null, 2), 'utf-8');

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

fsPromises.writeFile(saveFilePath, JSON.stringify(initialData, null, 2), 'utf-8')
  .then(() => console.log('Initial data written to file'))
  .catch((error: NodeJS.ErrnoException) => {
    console.error('Error writing initial data to file:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
  });

// Counter to track the number of requests
let requestCounter = 0;

// Add an endpoint to save posts
app.post('/posts', async (req, res) => {
  console.log('Received POST request at /posts with body:', req.body); // 요청 수신 로그 추가
  requestCounter++; // Increment the counter
  try {
    const result = await savePost(req.body);
    res.status(201).json({ ...result, requestCount: requestCounter }); // 응답에 카운터 추가
  } catch (error) {
    res.status(500).json({ error: 'Failed to save post' });
  }
});

// Add an endpoint to handle POST requests to the root path
app.post('/', async (req, res) => {
  console.log('Received POST request at / with body:', req.body); // 요청 수신 로그 추가
  requestCounter++; // Increment the counter
  try {
    // Read existing data from the file
    let existingData: Record<string, any>[] = [];
    try {
      const fileContent = await fsPromises.readFile(saveFilePath, 'utf-8');
      existingData = JSON.parse(fileContent);
      console.log('Existing data loaded:', existingData); // 디버깅 로그 추가
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw err; // 파일이 없을 때를 제외한 오류는 다시 던짐
      }
      console.log('posts.json not found, initializing with empty array.'); // 디버깅 로그 추가
    }

    // Add new data from the request body
    const newEntry = { id: existingData.length + 1, ...req.body, createdAt: new Date().toISOString() };
    existingData.push(newEntry);

    // Write updated data back to the file
    await fsPromises.writeFile(saveFilePath, JSON.stringify(existingData, null, 2), 'utf-8');
    console.log('Data saved to posts.json:', newEntry); // 저장된 데이터 로그 추가

    // Return response with counter
    res.status(201).json({ success: true, id: newEntry.id, requestCount: requestCounter }); // 응답에 카운터 추가
  } catch (error) {
    console.error('Error saving data to file:', error);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});