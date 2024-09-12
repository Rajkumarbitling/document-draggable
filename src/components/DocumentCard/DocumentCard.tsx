import React, { useMemo } from 'react';
import Image from '../Image/Image';
import './DocumentCard.css';
import { DocumentCardProps } from '../../types/App.types';

function getProxiedImageUrl(originalUrl: string): string {
  return `/api/proxy-image?url=${encodeURIComponent(originalUrl)}`;
}

const DocumentCard: React.FC<DocumentCardProps> = React.memo(({ doc, onImageClick }) => {
  const imageUrl = useMemo(() => {
    return getProxiedImageUrl('https://loremflickr.com/640/320');
  }, [doc.type]);

  return (
    <div className="document-card">
      <Image
        src={imageUrl}
        alt={doc.title}
        onClick={(e) => {
          e.stopPropagation();
          onImageClick(imageUrl);
        }}
      />
      <h3>{doc.title}</h3>
    </div>
  );
});

export default DocumentCard;
