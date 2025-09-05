import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from './firebase';
import { logger } from './logger';

export const uploadImageToFirebase = async ({
    image,
    path,
    userId,
}: {
    image: Express.Multer.File;
    path: string;
    userId: string | undefined;
}) => {
    try {
        if (!image) {
            logger.error('no image provided for upload');
            return;
        }
        const Storage = ref(
            storage,
            `${path}/${userId ? userId : `${image.originalname}-${Date.now()}`}`
        );

        const snapshot = await uploadBytes(Storage, image.buffer, { contentType: image.mimetype });

        const downloadUrl = await getDownloadURL(snapshot.ref);

        return {
            filename: image.originalname,
            url: downloadUrl,
            path: Storage.fullPath,
            uploadedAt: snapshot.metadata.timeCreated,
        };
    } catch (error: any) {
        logger.error(`Error uploading image: ${error.message}`);

        throw new Error(error.message);
    }
};
export const deleteImage = async (filePath: string | undefined) => {
    try {
        if (!filePath) return;
        const fileRef = ref(storage, filePath);

        if (!fileRef) {
            logger.error('Firebase file path reference is undefined');
        }

        await deleteObject(fileRef);
        logger.info(`File deleted successfully from path: ${filePath}`);
    } catch (error: any) {
        logger.error(error.message);
    }
};
