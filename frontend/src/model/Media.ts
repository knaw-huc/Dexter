import { Any } from '../components/common/Any';
import { UUID, WithId } from './Id';

export type SupportedMediaType = 'image/jpeg' | 'image/png';
export const supportedMediaTypes = ['image/jpeg', 'image/png'];

export function isImage(mediaType: string): boolean {
  return mediaType.split('/')[0] === 'image';
}

export const image = 'image';
export type FormMedia = {
  title: string;
  url: string;
};
export type ResultMedia = FormMedia &
  WithId & {
    mediaType: SupportedMediaType;
    createdBy: UUID;
  };

export function isMedia(toTest: Any): toTest is ResultMedia {
  return !!((toTest as ResultMedia)?.mediaType && (toTest as ResultMedia)?.url);
}
