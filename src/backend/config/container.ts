import "reflect-metadata";
import { container } from "tsyringe";
import UserRepository from "../features/user/user.repository";
import UserService from "../features/user/user.service";
import AuthService from "../features/auth/auth.service";
import AuthRepository from "../features/auth/auth.repository";

// you will register any
container.registerSingleton("IUserRepository", UserRepository);
container.registerSingleton("IUserService", UserService);
container.registerSingleton("IAuthService", AuthService);
container.registerSingleton("IAuthRepository", AuthRepository);

export { container as rootContainer } from "tsyringe";
