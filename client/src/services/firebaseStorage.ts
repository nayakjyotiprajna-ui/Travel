import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, isFirebaseConfigured } from '../config/firebase';

/**
 * Upload a memory image or captured postcard to Firebase Cloud Storage
 * @param file File or Blob representing the image
 * @param userId Unique identifier for the user
 * @param destinationName Name of the destination (for organizing folder structure)
 * @returns The public HTTPS download URL from Firebase Storage
 */
export const uploadMemoryImage = async (
  file: File | Blob,
  userId: string = 'guest',
  destinationName: string = 'general'
): Promise<string> => {
  if (!isFirebaseConfigured) {
    console.warn('[Firebase Storage] Real Firebase keys not configured. Falling back to Object URL for preview.');
    return URL.createObjectURL(file);
  }

  const cleanDestination = destinationName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const timestamp = Date.now();
  const filename = file instanceof File ? file.name.replace(/[^a-zA-Z0-9._-]/g, '') : `capture_${timestamp}.jpg`;
  const storagePath = `traveltwin/memories/${userId}/${cleanDestination}/${timestamp}_${filename}`;

  const storageRef = ref(storage, storagePath);
  const snapshot = await uploadBytes(storageRef, file, {
    contentType: file.type || 'image/jpeg',
  });

  const downloadUrl = await getDownloadURL(snapshot.ref);
  return downloadUrl;
};

/**
 * Upload a user avatar to Firebase Cloud Storage
 */
export const uploadUserAvatar = async (
  file: File | Blob,
  userId: string
): Promise<string> => {
  if (!isFirebaseConfigured) {
    return URL.createObjectURL(file);
  }

  const timestamp = Date.now();
  const storagePath = `traveltwin/avatars/${userId}/${timestamp}.jpg`;
  const storageRef = ref(storage, storagePath);

  const snapshot = await uploadBytes(storageRef, file, {
    contentType: file.type || 'image/jpeg',
  });

  return await getDownloadURL(snapshot.ref);
};
