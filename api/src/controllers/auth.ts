import "dotenv/config";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import users from "../db/queries/user";
import jwt from "jsonwebtoken";
import { matchedData, validationResult } from "express-validator";
import type { StringValue } from "ms";
import refreshTokens from "../db/queries/refreshTokens";
import { UserRegister, UserLogin } from "../db/queries/user";
import { sendVerificationEmail } from "../services/email";

function getSignedTokens({
  userId,
  username,
}: {
  userId: string;
  username: string;
}) {
  const accessToken = jwt.sign(
    { userId, username },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION! as StringValue },
  );
  const refreshToken = jwt.sign(
    { userId, username },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION! as StringValue },
  );
  return { accessToken, refreshToken };
}

export const handleLogin = async (req: Request, res: Response) => {
  const valResult = validationResult(req);
  if (!valResult.isEmpty()) {
    return res
      .status(400)
      .json({ error: valResult.array({ onlyFirstError: true }) });
  }
  try {
    const { email, password } = matchedData<UserLogin>(req);
    const foundUser = await users.getUserByEmail(email);
    if (!foundUser) return res.sendStatus(401);
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) return res.sendStatus(401);
    if (!foundUser.isVerified)
      return res.status(401).json({
        error: "user not verified",
        user: { userId: foundUser.userId, email: foundUser.email },
      });
    const { accessToken, refreshToken } = getSignedTokens({
      userId: foundUser.userId,
      username: foundUser.username,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
      path: "/auth/refresh-token",
    });
    await refreshTokens.upsertRefreshToken(foundUser.userId, refreshToken);
    return res.json({
      userId: foundUser.userId,
      username: foundUser.username,
      email: foundUser.email,
      accessToken,
    });
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};
export const handleRegister = async (req: Request, res: Response) => {
  const valResult = validationResult(req);
  if (!valResult.isEmpty()) {
    return res
      .status(400)
      .json({ error: valResult.array({ onlyFirstError: true }) });
  }
  try {
    const { username, password, email } = matchedData<UserRegister>(req);
    const passwordHash = bcrypt.hashSync(password);
    const result = await users.createUser({
      username,
      password: passwordHash,
      email,
    });
    const verificationToken = jwt.sign(
      { userId: result.userId },
      process.env.VERIFICATION_TOKEN_SECRET!,
      { expiresIn: process.env.VERIFICATION_TOKEN_EXPIRATION! as StringValue },
    );
    await Promise.all([
      users.upsertVerificationToken(result.userId, verificationToken),
      sendVerificationEmail(email, verificationToken),
    ]);
    return res.json({
      userId: result.userId,
      username: result.username,
      email: result.email,
    });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
};
export const handleRefreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) return res.sendStatus(401);
  try {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
      async (err: any, payload: any) => {
        if (err) return res.sendStatus(401);
        const user = await users.getUserById(payload?.userId);
        if (!user) {
          await refreshTokens.removeRefreshToken(payload.userId);
          return res.sendStatus(401);
        }
        const accessToken = jwt.sign(
          {
            userId: user.userId,
            username: user.username,
            email: user.email,
          },
          process.env.ACCESS_TOKEN_SECRET!,
          { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION! as StringValue },
        );
        const newRefreshToken = jwt.sign(
          {
            userId: user.userId,
            username: user.username,
            email: user.email,
          },
          process.env.REFRESH_TOKEN_SECRET!,
          { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION! as StringValue },
        );
        await refreshTokens.upsertRefreshToken(user.userId, newRefreshToken);
        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
          sameSite: "none",
          secure: true,
          path: "/auth/refresh-token",
        });
        return res.json({ accessToken });
      },
    );
  } catch (e) {
    return res.sendStatus(500);
  }
};
export const handleLogout = async (req: Request, res: Response) => {
  try {
    await refreshTokens.removeRefreshToken(req.user!.userId);
    return res.sendStatus(204);
  } catch (e) {
    return res.sendStatus(500);
  }
};

export const handleVerifyEmail = async (req: Request, res: Response) => {
  try {
    const { verificationToken } = req.body;
    jwt.verify(
      verificationToken,
      process.env.VERIFICATION_TOKEN_SECRET!,
      async (err: any, payload: any) => {
        if (err) return res.sendStatus(400);
        const user = await users.getVerificationToken(payload?.userId);
        if (!user || verificationToken !== user.token) {
          return res.sendStatus(400);
        }
        await Promise.all([
          users.verifyUser(user.userId),
          users.removeVerificationToken(user.userId),
        ]);
        return res.sendStatus(200);
      },
    );
  } catch (e) {
    return res.sendStatus(500);
  }
};

export const handleResendVerificationEmail = async (
  req: Request,
  res: Response,
) => {
  try {
    const { userId, email } = req.body;
    const verificationToken = jwt.sign(
      { userId: userId },
      process.env.VERIFICATION_TOKEN_SECRET!,
      { expiresIn: process.env.VERIFICATION_TOKEN_EXPIRATION! as StringValue },
    );
    await Promise.all([
      users.upsertVerificationToken(userId, verificationToken),
      sendVerificationEmail(email, verificationToken),
    ]);
    return res.sendStatus(200);
  } catch (e) {
    return res.sendStatus(500);
  }
};
