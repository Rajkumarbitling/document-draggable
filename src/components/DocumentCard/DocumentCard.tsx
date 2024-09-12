import React, { useMemo } from 'react';
import Image from '../Image/Image';
import './DocumentCard.css';
import { DocumentCardProps } from '../../types/App.types';

function getProxiedImageUrl(originalUrl: string): string {
  return `/api/proxy-image/${encodeURIComponent(originalUrl)}`;
}

const DocumentCard: React.FC<DocumentCardProps> = React.memo(({ doc, onImageClick }) => {
  const imageUrl = getProxiedImageUrl('640/320');

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
