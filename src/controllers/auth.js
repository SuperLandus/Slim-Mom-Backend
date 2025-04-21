import {
  registerUser,
  getUser,
  loginUser,
  refreshUser,
} from '../services/auth.js';
import createHttpError from 'http-errors';
import { ONE_DAY } from '../constants/index.js';
import jwt from 'jsonwebtoken';
import { SessionCollection } from '../db/models/sessions.js';

export const registerUserController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await getUser(email);

    if (user) {
      return next(createHttpError(409, 'Email in use'));
    }

    const {session, user:newUser} = await registerUser({ name, email, password });
    const userwithoutpass = { ...newUser };
    delete userwithoutpass.password;
    //user can enter the host without login
    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + ONE_DAY),
    });
    res.cookie('sessionId', session._id, {
      httpOnly: true,
      expires: new Date(Date.now() + ONE_DAY),
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: {
        id: userwithoutpass._id,
        name: userwithoutpass.name,
        email: userwithoutpass.email,
        createdAt: userwithoutpass.createdAt,
        updatedAt: userwithoutpass.updatedAt,
        accessToken: session.accessToken,
      },
      token,
    });
  } catch (error) {
    next(createHttpError(500, error));
  }
};

export const loginUserController = async (req, res) => {
  const {session, user} = await loginUser(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });


  const userInfo = {
    name: user.name,
    email: user.email,
  };

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
      user: userInfo,
    },
  });
};

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
};

export const refreshUserController = async (req, res, next) => {
  try {
    const session = await refreshUser({
      sessionId: req.cookies.sessionId,
      refreshToken: req.cookies.refreshToken,
    });
    console.log(session);
    console.log('Cookies:', req.cookies);

    setupSession(res, session);
    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken: session.accessToken },
    });
  } catch (e) {
    next(createHttpError(e.status || 500, e.message));
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const accessToken = req.get('Authorization')?.split(' ')[1];
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
      return res
        .status(401)
        .json({ message: 'Authorization error: Token not found' });
    }

    let session;
    if (accessToken) {
      session = await SessionCollection.findOne({ accessToken });
    }

    if (!session && refreshToken) {
      session = await SessionCollection.findOne({ refreshToken });
    }

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    await SessionCollection.findByIdAndDelete(session._id);

    res.clearCookie('refreshToken');
    res.clearCookie('sessionId');

    res.status(200).json({ message: 'Successfully logged out' });
  } catch (error) {
    next(createHttpError(500, error.message || 'Internal Server Error'));
  }
};
