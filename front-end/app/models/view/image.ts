import { Photo } from 'react-photo-album';

export interface IdentifyablePhoto extends Photo { 
  id: string
}