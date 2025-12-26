import { Gender, UserRole, IUser } from "../../user/user.model";
import { IRestaurant, ShopCategory } from "../../restaurant/restaurant.model";

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
  // Optional subscription fields (populated for organizers, recycleMen and shops/restaurants)
  subscribed?: boolean;
  subscriptionPeriod?: string | Date;
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
    category: string;
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
  const isUsr = isUser(user);
  const role = isUsr ? user.role! : "shop";

  // Include subscription info only for organizers, recycleMen, and shops/restaurants.
  const includeSubscription =
    (isUsr && (user.role === "organizer" || user.role === "recycleMan")) ||
    !isUsr;

  const subscribed = includeSubscription
    ? (user as Partial<IUser | IRestaurant>).subscribed ?? false
    : undefined;

  const rawPeriod = includeSubscription
    ? (user as Partial<IUser | IRestaurant>).subscriptionPeriod
    : undefined;

  const subscriptionPeriod =
    rawPeriod instanceof Date
      ? rawPeriod.toISOString()
      : rawPeriod
      ? String(rawPeriod)
      : undefined;

  return {
    id: `${user._id}`,
    email: user.email!,
    image: user.avatar?.url,
    name: isUsr ? user.firstName! : user.name!,
    role,
    ...(includeSubscription ? { subscribed, subscriptionPeriod } : {}),
  };
};

const isUser = (
  u: Partial<IUser> | Partial<IRestaurant>
): u is Partial<IUser> => {
  return "firstName" in u;
};
