import { Gender, UserRole, IUser } from "../../user/user.model";
import { IRestaurant } from "../../restaurant/restaurant.model";

export type LoginRequestDTO = {
  email: string;
  password: string;
};

export type LoginResponse = {
  id: string;
  email: string;
  name: string;
  role: string;
  image?: string;
};

export type RegisterResponseDTO = {
  success: boolean;
};

export type UserTypes = UserRole | "shop";

export type OAuthUserDTO = RegisterRequestDTO &
  RegisterForConsumer & {
    role: UserTypes;
    oAuthId: string;
    provider?: string;
  };

export type UserRegisterDTO = RegisterWithCredentialsDTO &
  RegisterForConsumer &
  RegisterWithPhoneNumber & {
    birthDate: string;
    gender: Gender;
    address?: string;
  };

export type ShopRegisterDTO = RegisterWithCredentialsDTO &
  RegisterWithPhoneNumber & {
    name: string;
    description: string;
    hotline: string;
    location?: string;
    workingHours: string;
  };

export type RegisterRequestDTO = {
  email: string;
  role: UserTypes;
};

export type RegisterWithCredentialsDTO = RegisterRequestDTO & {
  password: string;
};

export type RegisterForConsumer = {
  firstName: string;
  lastName: string;
};

export type RegisterWithPhoneNumber = {
  phoneNumber: string;
};

export const mapToUserPublicProfile = (
  user: Partial<IUser> | Partial<IRestaurant>
) => {
  return {
    id: `${user._id}`,
    email: user.email!,
    image: user.avatar?.url,
    name: isUser(user) ? user.lastName! : user.name!,
    role: isUser(user) ? user.role! : "shop",
  };
};

const isUser = (
  u: Partial<IUser> | Partial<IRestaurant>
): u is Partial<IUser> => {
  return "lastName" in u;
};
