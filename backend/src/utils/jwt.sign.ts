import jwt from 'jsonwebtoken';
import defaults from '@/config/defaults';

export const signJwt = async (
    object: object,
    keyNameIdentifier: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
    KeyEncryption: 'HS512' | 'RS256', // Ensure this matches supported algorithms
    options?: jwt.SignOptions | undefined
) => {
    if (!['HS512', 'RS256'].includes(KeyEncryption)) {
        throw new Error(
            `Invalid KeyEncryption algorithm provided: ${KeyEncryption}. Supported algorithms are "HS512" and "RS256".`
        );
    }

    const rawKey = defaults[keyNameIdentifier as keyof typeof defaults] as string;

    const signingKey =
        KeyEncryption === 'HS512'
            ? rawKey // use plain string or .env variable
            : Buffer.from(rawKey, 'base64').toString('ascii'); // for RS256 (PEM base64)

    return jwt.sign(object, signingKey, {
        ...(options && options),
        algorithm: KeyEncryption, // Default to RS256 if not specified
    });
};

export const verifyJwt = async (
    token: string,
    keyNameIdentifier: 'accessTokenPublicKey' | 'refreshTokenPublicKey',
    KeyEncryption: 'HS512' | 'RS256'
): Promise<{ valid: boolean; expired: unknown; decoded: unknown }> => {
    try {
        const publicKey =
            KeyEncryption === 'HS512'
                ? (defaults[keyNameIdentifier as keyof typeof defaults] as string)
                : Buffer.from(
                      defaults[keyNameIdentifier as keyof typeof defaults] as string,
                      'base64'
                  ).toString('ascii');

        const decoded = jwt.verify(token, publicKey);

        return {
            valid: true,
            expired: false,
            decoded,
        };
    } catch (error: any) {
        return {
            valid: false,
            expired: (error.message = 'jwt expired'),
            decoded: null,
        };
    }
};
