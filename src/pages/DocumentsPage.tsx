import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DocumentCard from '../components/DocumentCard/DocumentCard';
import Overlay from '../components/Overlay/Overlay';
import { worker, getDocuments, saveDocuments } from '../mocks/browser';
import { Document } from '../types/App.types';
import LoaderOverlay from '../components/LoaderOverlay';

// Loading component
const LoadingDocuments = () => (
    <LoaderOverlay>
        <div>Loading Documents...</div>
    </LoaderOverlay>
);

// Saving component
const Saving = () => (
  <LoaderOverlay>
    <div>Saving...</div>
  </LoaderOverlay>
);

// Draggable Document component
const DraggableDocument: React.FC<{ doc: Document; index: number; moveDocument: (dragIndex: number, hoverIndex: number) => void; onImageClick: (url: string) => void }> = ({ doc, index, moveDocument, onImageClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop({
    accept: 'document',
    hover(item: { index: number }, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveDocument(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'document',
    item: () => ({ id: doc.id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }} className='w-100'>
      <DocumentCard doc={doc} onImageClick={onImageClick} />
    </div>
  );
};

// Document List component
const DocumentList: React.FC<{ documents: Document[], onImageClick: (url: string) => void, moveDocument: (dragIndex: number, hoverIndex: number) => void }> = ({ documents, onImageClick, moveDocument }) => (
  <div className="document-grid">
    {documents.map((doc, index) => (
      <DraggableDocument
        key={doc.id}
        doc={doc}
        index={index}
        moveDocument={moveDocument}
        onImageClick={onImageClick}
      />
    ))}
  </div>
);

const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const [timeSinceLastSave, setTimeSinceLastSave] = useState<string | null>(null);
  const hasChanges = useRef<boolean>(false);
  const documentsRef = useRef<Document[]>([]);

  // Start the worker
  useEffect(() => {
    worker.start();
  }, []);

  // Load data from localStorage
  useEffect(() => {
    const loadDocuments = async () => {
      setIsLoading(true);
      const loadedDocuments = getDocuments();
      setDocuments(loadedDocuments);
      documentsRef.current = loadedDocuments;
      setIsLoading(false);
      console.log('Initial documents loaded:', loadedDocuments);
    };
    loadDocuments();
  }, []);

  // Set up interval to save changes every 5 seconds
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (hasChanges.current) {
        saveChanges();
      }
    }, 5000);

    return () => clearInterval(saveInterval);
  }, []);

  // useEffect for updating the time since last save
  useEffect(() => {
    if (!lastSaveTime) return;

    const intervalId = setInterval(() => {
      const secondsSinceLastSave = Math.round((new Date().getTime() - lastSaveTime.getTime()) / 1000);
      const minutes = Math.floor(secondsSinceLastSave / 60);
      const seconds = secondsSinceLastSave % 60;
      setTimeSinceLastSave(`${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [lastSaveTime]);


  // FOr saving the changes
  const saveChanges = async (): Promise<void> => {
    setIsSaving(true);
    console.log('Attempting to save documents:', documentsRef.current);
    try {
      setLastSaveTime(new Date());
      setTimeSinceLastSave("");
      await saveDocuments(documentsRef.current);
      hasChanges.current = false;
      console.log('Documents saved successfully');
    } catch (error) {
      console.error('Error saving documents:', error);
    } finally {
      setIsSaving(false);
    }
  };


  // onDragEnd save the reordered documents
  const moveDocument = useCallback((dragIndex: number, hoverIndex: number) => {
    setDocuments((prevDocs) => {
      const newDocs = [...prevDocs];
      const [removed] = newDocs.splice(dragIndex, 1);
      newDocs.splice(hoverIndex, 0, removed);
      
      const reorderedDocuments = newDocs.map((item, index) => ({
        ...item,
        position: index
      }));

      documentsRef.current = reorderedDocuments;
      hasChanges.current = true;
      console.log('Documents reordered:', reorderedDocuments);
      return reorderedDocuments;
    });
  }, []);

  const handleCloseOverlay = useCallback((): void => setSelectedImage(null), []);
  const handleImageClick = useCallback((imageUrl: string): void => {
    setSelectedImage(imageUrl);
  }, []);

  if (isLoading) {
    return <LoadingDocuments />;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      {documents.length > 0 ? (
        <DocumentList documents={documents} onImageClick={handleImageClick} moveDocument={moveDocument} />
      ) : (
        <div>No documents available.</div>
      )}

      {selectedImage && <Overlay image={selectedImage} onClose={handleCloseOverlay} />}
      
      {isSaving && <Saving />}
      
      {lastSaveTime && (
        <div className="last-save-time">
          Last saved: {timeSinceLastSave} ago
        </div>
      )}
    </DndProvider>
  );
}

export default DocumentsPage;