import { Hmac, createHmac, randomBytes } from "node:crypto";
import { prismaClient } from "../lib/db";
import JWT from "jsonwebtoken";
export interface CreateUserPayload {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}
const JWTSECRET = "supresecret";

export interface GetUserTokenPayload {
  email: string;
  password: string;
}

class UserService {
  public static async createUser(payload: CreateUserPayload) {
    const { firstName, lastName, email, password } = payload;

    const salt = randomBytes(64).toString("hex");

    const hashedPassword = UserService.generateHash(salt, password);
    return prismaClient.user.create({
      data: {
        firstName,
        lastName,
        email,
        salt,
        password: hashedPassword,
      },
    });
  }

  private static generateHash(salt: string, password: string) {
    const hashedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");
    return hashedPassword;
  }

  private static async getUserByEmail(email: string) {
    return prismaClient.user.findUnique({ where: { email } });
  }

  public static async GetUserToken(payload: GetUserTokenPayload) {
    const { email, password } = payload;

    const user = await this.getUserByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }
    const hashedPassword = UserService.generateHash(user.salt, password);

    if (hashedPassword !== user.password) {
      throw new Error("Invalid password");
    }
    // generate token refresh and access token
    const token = JWT.sign(
      {
        id: user.id,
        email: user.email,
      },
      JWTSECRET,
      {
        expiresIn: "1d",
      }
    );

    return token;
  }

  public static decodeJWTToken(token: string) {
    return JWT.verify(token, JWTSECRET);
  }

  public static async getUserById(id: string) {
    return await prismaClient.user.findUnique({ where: { id } });
  }
}
export default UserService;
