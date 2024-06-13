import { UploadcareSimpleAuthSchema } from '@uploadcare/rest-client';

export const getUploadcareSimpleAuthSchema = () => {
    const {
        UPLOADCARE_PUBLIC_KEY: publicKey,
        UPLOADCARE_SECRET_KEY: secretKey
    } = process.env;

    if (!publicKey || !secretKey) throw new Error('Missing UploadCare configuration');

    return new UploadcareSimpleAuthSchema({
        publicKey,
        secretKey
    });
};
