import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserCollection } from '../db/models/users.js';
import { SessionCollection } from '../db/models/sessions.js';
import createHttpError from 'http-errors';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';
import mongoose from 'mongoose';
import { randomBytes } from 'crypto';

export const registerUser = async (payload) => {
  try {
    const user = await UserCollection.findOne({ email: payload.email });
    if (user) throw createHttpError(409, 'email in use');
    const encryptedPassword = await bcrypt.hash(payload.password, 10);
    const createdUser = await UserCollection.create({
      ...payload,
      password: encryptedPassword,
    });
    return createdUser;
  } catch (e) {
    throw createHttpError(
      e.status || 500,
      e.message || 'Failed to create user',
    );
  }
};

export const getUser = async (email) => {
  try {
    const userAuth = await SessionCollection.findOne({ email: email });
    return userAuth;
  } catch (e) {
    throw new Error('Failed to fetch users', e);
  }
};

const ACCESS_TOKEN_EXPIRY = '15m';

const REFRESH_TOKEN_EXPIRY = '30d';

export const loginUser = async (payload) => {
  const user = await UserCollection.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
  const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

  const session = await SessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });

  // ✅ session ve user birlikte döndürülüyor
  return {
    ...session._doc, // session detayları
    user: {
      name: user.name,
      email: user.email,
    },
  };
};

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  };
};
export const refreshUser = async ({ sessionId, refreshToken }) => {
  try {
    const objectId = mongoose.Types.ObjectId.createFromHexString(sessionId);
    const session = await SessionCollection.findOne({
      _id: objectId,
      refreshToken,
    });

    if (!session) {
      throw createHttpError(404, 'Session not found');
    }
    console.log('Found Session:', session);
    const isSessionTokenExpired =
      new Date() > new Date(session.refreshTokenValidUntil);

    if (isSessionTokenExpired) {
      throw createHttpError(401, 'Session token expired');
    }

    const newSession = createSession();

    await SessionCollection.deleteOne({ _id: objectId, refreshToken });

    return await SessionCollection.create({
      userId: session.userId,
      ...newSession,
    });
  } catch (e) {
    throw createHttpError(e.status || 500, e.message);
  }
};
