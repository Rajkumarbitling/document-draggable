import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';
import initialDocumentsData from '../documents.json';

export const worker = setupWorker(...handlers);

// Function to get documents from localStorage or initialize if not present
export const getDocuments = () => {
  const storedDocs = localStorage.getItem('documents');
  if (storedDocs) {
    return JSON.parse(storedDocs);
  } else {
    const initialDocs = initialDocumentsData.map((doc, index) => ({
      ...doc,
      id: `doc-${index + 1}`,
      position: index
    }));
    localStorage.setItem('documents', JSON.stringify(initialDocs));
    return initialDocs;
  }
};

// Function to save documents to localStorage
export const saveDocuments = (documents) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      localStorage.setItem('documents', JSON.stringify(documents));
      console.log('Documents saved to localStorage:', documents);
      resolve()
    }, 1000);
  })
};

// Start the worker with error handling
if (process.env.NODE_ENV === 'development') {
  worker.start({
    onUnhandledRequest: 'bypass',
  }).catch(error => {
    console.error('Error starting MSW worker:', error);
  });
}
