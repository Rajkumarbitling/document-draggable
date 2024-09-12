import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
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

// Document List component
const DocumentList: React.FC<{ documents: Document[], onImageClick: (url: string) => void, onDragEnd: (result: DropResult) => void }> = ({ documents, onImageClick, onDragEnd }) => (
  <DragDropContext onDragEnd={onDragEnd}>
    <Droppable droppableId="documents" direction="horizontal">
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef} className="document-grid">
          {documents.map((doc, index) => (
            <Draggable key={doc.id} draggableId={doc.id} index={index}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className='w-100'
                >
                  <DocumentCard 
                    doc={doc} 
                    onImageClick={onImageClick}
                  />
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </DragDropContext>
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
  const handleDragEnd = useCallback((result: DropResult): void => {
    if (!result.destination) return;

    setDocuments(prevDocs => {
      const items = Array.from(prevDocs);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination!.index, 0, reorderedItem);

      const reorderedDocuments = items.map((item, index) => ({
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
    <>
      {documents.length > 0 ? (
        <DocumentList documents={documents} onImageClick={handleImageClick} onDragEnd={handleDragEnd} />
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
    </>
  );
}

export default DocumentsPage;