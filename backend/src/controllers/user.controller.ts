import { pool } from "../db.js";
import type { User, UserFollow } from "../models/user.js";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";

/**
 * getUser
 * @param cognitoUserId
 * @returns `User | null`
 */
export async function getUser(cognitoUserId: string): Promise<User | null> {
  const sql = `
    SELECT cognito_user_id, display_id, display_name, bio, icon_image_url
    FROM users
    WHERE cognito_user_id = ?
    LIMIT 1;
  `;

  const [rows] = await pool.query<User[] & RowDataPacket[]>(sql, [
    cognitoUserId,
  ]);

  return rows.length > 0 ? rows[0] : null;
}

/**
 * getCognitoUserIdByDisplayId
 * @param displayId
 * @returns cognitoUserId
 */
export async function getCognitoUserIdByDisplayId(
  displayId: string,
): Promise<string> {
  const sql = `
    SELECT cognito_user_id
    FROM users
    WHERE display_id = ?
    LIMIT 1;
  `;

  try {
    const [rows] = await pool.query<RowDataPacket[]>(sql, [displayId]);
    return rows.length > 0
      ? (rows[0] as { cognito_user_id: string }).cognito_user_id
      : "";
  } catch (err) {
    console.error("Error in getCognitoUserIdByDisplayId:", err);
    throw new Error("Failed to fetch user by displayId");
  }
}

/**
 * createUser
 * @param params User
 * @returns `User | null`
 */
export async function createUser(params: {
  cognitoUserId: string;
  displayId: string;
  displayName: string;
  bio?: string;
  iconImageUrl?: string;
}): Promise<User | null> {
  const sql = `
    INSERT INTO users (cognito_user_id, display_id, display_name, bio, icon_image_url, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
  `;

  const { cognitoUserId, displayId, displayName, bio, iconImageUrl } = params;

  try {
    const [result] = await pool.query<ResultSetHeader>(sql, [
      cognitoUserId,
      displayId,
      displayName,
      bio ?? "",
      iconImageUrl ?? null,
    ]);

    if (result.affectedRows === 0) {
      return null;
    }

    return await getUser(cognitoUserId);
  } catch (err) {
    console.error("Error in createUserProfile:", err);
    throw new Error("Failed to create user profile");
  }
}

/**
 * updateUser
 * @param params User
 * @returns `User | null`
 */
export async function updateUser(params: {
  cognitoUserId: string;
  displayId?: string;
  displayName?: string;
  bio?: string;
  iconImageUrl?: string;
}): Promise<User | null> {
  const { cognitoUserId, displayId, displayName, bio, iconImageUrl } = params;

  const updateFields: string[] = [];
  const values: string[] = [];

  if (displayId !== undefined) {
    updateFields.push("display_id = ?");
    values.push(displayId);
  }
  if (displayName !== undefined) {
    updateFields.push("display_name = ?");
    values.push(displayName);
  }
  if (bio !== undefined) {
    updateFields.push("bio = ?");
    values.push(bio);
  }
  if (iconImageUrl !== undefined) {
    updateFields.push("icon_image_url = ?");
    values.push(iconImageUrl);
  }

  if (updateFields.length === 0) {
    return await getUser(cognitoUserId);
  }

  updateFields.push("updated_at = CURRENT_TIMESTAMP");

  const sql = `
    UPDATE users
    SET ${updateFields.join(", ")}
    WHERE cognito_user_id = ?;
  `;
  values.push(cognitoUserId);

  try {
    const [result] = await pool.query<ResultSetHeader>(sql, values);

    if (result.affectedRows === 0) {
      return null;
    }

    return await getUser(cognitoUserId);
  } catch (err) {
    console.error("Error in updateUserProfile:", err);
    throw new Error("Failed to update user profile");
  }
}

/**
 * getFollowing
 * @param cognitoUserId
 * @returns `User[]`
 */
export async function getFollowing(cognitoUserId: string): Promise<User[]> {
  const sql = `
    SELECT u.*
    FROM user_follows f
           JOIN users u ON f.followed_id = u.cognito_user_id
    WHERE f.follower_id = ?;
  `;

  const [rows] = await pool.query<User[] & RowDataPacket[]>(sql, [
    cognitoUserId,
  ]);
  return rows;
}

/**
 * getFollowers
 * @param cognitoUserId
 * @returns `User[]`
 */
export async function getFollowers(cognitoUserId: string): Promise<User[]> {
  const sql = `
    SELECT u.*
    FROM user_follows f
           JOIN users u ON f.follower_id = u.cognito_user_id
    WHERE f.followed_id = ?;
  `;

  const [rows] = await pool.query<User[] & RowDataPacket[]>(sql, [
    cognitoUserId,
  ]);
  return rows;
}

/**
 * followUser
 * @param followerId
 * @param followedId
 * @returns `UserFollow`
 */
export async function followUser(
  followerId: string,
  followedId: string,
): Promise<UserFollow> {
  const sql = `
    INSERT INTO user_follows (follower_id, followed_id)
    VALUES (?, ?);
  `;

  const [result] = await pool.query<ResultSetHeader>(sql, [
    followerId,
    followedId,
  ]);

  return {
    id: result.insertId,
    follower_id: followerId,
    followed_id: followedId,
  } as UserFollow;
}

/**
 * unfollowUser
 * @param followerId
 * @param followedId
 * @returns `boolean`
 */
export async function unfollowUser(
  followerId: string,
  followedId: string,
): Promise<boolean> {
  const sql = `
    DELETE
    FROM user_follows
    WHERE follower_id = ?
      AND followed_id = ?;
  `;

  const [result] = await pool.query<ResultSetHeader>(sql, [
    followerId,
    followedId,
  ]);

  return result.affectedRows > 0;
}

/**
 * removeFollower
 * @param followerId
 * @param followedId
 * @returns `boolean`
 */
export async function removeFollower(
  followerId: string,
  followedId: string,
): Promise<boolean> {
  const sql = `
    DELETE
    FROM user_follows
    WHERE follower_id = ?
      AND followed_id = ?;
  `;

  const [result] = await pool.query<ResultSetHeader>(sql, [
    followerId,
    followedId,
  ]);

  return result.affectedRows > 0;
}
