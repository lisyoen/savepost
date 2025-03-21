import axios from 'axios';

const API_URL = 'https://lisyoen.iptime.org:4040/savepost';

export async function savePost(data: Record<string, any>): Promise<any> {
  try {
    const response = await axios.post(API_URL, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error saving post:', error);
    throw error;
  }
}