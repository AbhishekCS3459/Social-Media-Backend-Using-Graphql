import UserService, {
  CreateUserPayload,
  GetUserTokenPayload,
} from "../../services/User";

const queries = {
  getUserToken: async (_: any, payload: GetUserTokenPayload) => {
    try {
      const token = await UserService.GetUserToken({
        email: payload.email,
        password: payload.password,
      });
      return token;
    } catch (e: any) {
      throw new Error(e.message);
    }
  },
  getCurrentUserLoggedInUser: async (_: any, parameters: any, context: any) => {
    if(context&& context.user){
      const id=context.user.id;
      const user=await UserService.getUserById(id);
      return user;
    }
    throw new Error("User not found");
  },
};

const mutations = {
  createUser: async (_: any, payload: CreateUserPayload) => {
    const user = await UserService.createUser(payload);
    return user.id;
  },
};

export const resolvers = { queries, mutations };
