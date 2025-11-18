import "reflect-metadata";
import { container } from "tsyringe";
import UserRepository from "../features/user/user.repository";
import UserService from "../features/user/user.service";
import AuthService from "../features/auth/auth.service";
import AuthRepository from "../features/auth/auth.repository";
import RestaurantService from "../features/resturant/resturant.service";
import RestaurantRepository from "../features/resturant/resturant.repository";
import ReviewRepository from "../features/review/review.repository";
import ReviewService from "../features/review/review.service";

// you will register any
container.registerSingleton("IUserRepository", UserRepository);
container.registerSingleton("IUserService", UserService);
container.registerSingleton("IAuthService", AuthService);
container.registerSingleton("IAuthRepository", AuthRepository);
container.registerSingleton("IRestaurantService", RestaurantService);
container.registerSingleton("IRestaurantRepository", RestaurantRepository);
container.registerSingleton("IReviewRepository", ReviewRepository);
container.registerSingleton("IReviewService", ReviewService);

export { container as rootContainer } from "tsyringe";
