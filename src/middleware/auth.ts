import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';

export interface AuthUser {
  uid: string;
  email: string;
  name?: string;
  picture?: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split('Bearer ')[1]?.trim();
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Empty token' });
  }

  // Support demo/guest adventurer for seamless instant testing if needed
  if (token.startsWith('demo-guest-token')) {
    const parts = token.split(':');
    const guestUid = parts[1] || 'demo-adventurer-hero';
    const guestEmail = parts[2] || 'hero@lifequest.realm';
    req.user = {
      uid: guestUid,
      email: guestEmail,
      name: 'Arthur the Brave',
    };
    return next();
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || `${decodedToken.uid}@lifequest.realm`,
      name: decodedToken.name || (decodedToken.email ? decodedToken.email.split('@')[0] : 'Hero'),
      picture: decodedToken.picture,
    };
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
