export interface Document {
  id: string;
  title: string;
  position: number;
  imageUrl: string;
  type: string;
}

export interface ImageProps {
  src: string;
  alt: string;
  onClick?: (event: React.MouseEvent<HTMLImageElement>) => void;
  className?: string;
}

export interface OverlayProps {
  image?: string;
  onClose?: () => void;
  children?: React.ReactNode;
}

export interface DocumentCardProps {
  doc: Document;
  onImageClick: (imageUrl: string) => void;
}

export interface LoaderOverlayProps {
  children?: React.ReactNode;
}