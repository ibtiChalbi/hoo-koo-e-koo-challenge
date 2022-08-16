import { apiUrlMatcher, ApiUrlsEnum, post, get } from "./helpers";
import { HttpParamsType } from "../models";
import { LoginDTO } from "../generated/LoginDto";
import { UserDTO } from "../generated/UserDto";
import { UserDetails } from "../models/user/user-details";
import { SignupDTO } from "core/generated/SignupDto";

export async function authenticate(
  params: HttpParamsType<LoginDTO>
): Promise<UserDetails> {
  const user = await post<UserDTO>(
    apiUrlMatcher(ApiUrlsEnum.Authenticate),
    params
  );

  return UserDetails.mapToApiValue(user);
}

export async function register(
  params: HttpParamsType<SignupDTO>
): Promise<UserDetails> {
  const user = await post<UserDTO>(apiUrlMatcher(ApiUrlsEnum.Register), params);

  return UserDetails.mapToApiValue(user);
}

export async function checkToken(): Promise<UserDetails> {
  const user = await get<UserDTO>(apiUrlMatcher(ApiUrlsEnum.CheckToken));

  return UserDetails.mapToApiValue(user);
}
