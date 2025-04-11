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