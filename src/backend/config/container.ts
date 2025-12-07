import "reflect-metadata";
import { container } from "tsyringe";
import UserRepository from "../features/user/user.repository";
import UserService from "../features/user/user.service";
import AuthRepository from "../features/auth/auth.repository";
import RestaurantService from "../features/restaurant/restaurant.service";
import RestaurantRepository from "../features/restaurant/restaurant.repository";
import { RegistrationFactory } from "../features/auth/registration/registration.strategy.factory";
import { EndUserRegistration } from "../features/auth/registration/endUser.registration";
import { RegistrationService } from "../features/auth/registration/registration.service";
import { ShopRegistration } from "../features/auth/registration/shop.registration";
import { OrganizerRegistration } from "../features/auth/registration/organizer.registration";
import { LoginService } from "../features/auth/login/users.login.service";
import { ImageService } from "../services/image.service";
import { UploadService } from "../features/upload/upload.service";
import { UploadRepository } from "../features/upload/upload.repository";
import EventService from "../features/event/event.service";
import EventRepository from "../features/event/event.repository";

// you will register any
container.registerSingleton("IUserRepository", UserRepository);
container.registerSingleton("IUserService", UserService);
container.registerSingleton("IEventService", EventService);
container.registerSingleton("IEventRepository", EventRepository);
container.registerSingleton("IAuthRepository", AuthRepository);
container.registerSingleton("IRestaurantService", RestaurantService);
container.registerSingleton("IRestaurantRepository", RestaurantRepository);
container.registerSingleton("RegistrationService", RegistrationService);
container.registerSingleton("RegistrationFactory", RegistrationFactory);
container.registerSingleton("EndUserRegistration", EndUserRegistration);
container.registerSingleton("ShopRegistration", ShopRegistration);
container.registerSingleton("OrganizerRegistration", OrganizerRegistration);
container.registerSingleton("LoginService", LoginService);
container.registerSingleton("ImageService", ImageService);
container.registerSingleton("UploadService", UploadService);
container.registerSingleton("UploadRepository", UploadRepository);

export { container as rootContainer } from "tsyringe";
