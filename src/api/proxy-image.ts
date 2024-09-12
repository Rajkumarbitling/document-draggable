import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ message: 'Bad Request: URL is missing' });
  }

  try {
    const response = await fetch(url);
    const contentType = response.headers.get('Content-Type') || 'image/jpeg';

    if (!response.ok) {
      return res.status(response.status).json({ message: response.statusText });
    }

    const imageBuffer = await response.arrayBuffer();
    res.setHeader('Content-Type', contentType);
    res.send(Buffer.from(imageBuffer));
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
