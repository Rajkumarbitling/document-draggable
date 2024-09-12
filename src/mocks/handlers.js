import { http, HttpResponse } from 'msw';
import docs from '../documents.json'

let documents = docs;

export const handlers = [
  http.get('/api/documents', () => {
    return HttpResponse.json(documents);
  }),

  http.put('/api/documents', async ({ request }) => {
    const updatedDocuments = await request.json();
    documents = updatedDocuments;
    return HttpResponse.json({ message: 'Documents updated successfully' });
  }),

  http.get('/api/proxy-image', async ({ request }) => {
    const url = new URL(request.url);
    const imageUrl = url.searchParams.get('url');
    if (!imageUrl) {
      return new HttpResponse(null, { status: 400, statusText: 'Bad Request' });
    }

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      return new HttpResponse(blob, {
        headers: {
          'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
        },
      });
    } catch (error) {
      console.error('Error fetching image:', error);
      return new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' });
    }
  }),
];
