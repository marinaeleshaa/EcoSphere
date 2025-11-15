import "reflect-metadata";
import { container } from "tsyringe";
import UserRepository from "../features/user.repository";
import UserService from "../features/user.service";

// you will register any
container.registerSingleton("IUserRepository", UserRepository);
container.registerSingleton("IUserService", UserService);

export { container as rootContainer } from "tsyringe";
