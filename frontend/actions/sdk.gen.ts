import { signIn } from "next-auth/react";
import {
  CheckSessionActiveStatus,
  ConversationCreationResponseI,
  ConversationQuery,
  ConversationUpatingResponseI,
  ConversationUpdatingProps,
  discoverFriendI,
  handleFriendRequestI,
  Login,
  LoginResponseI,
  logoutProps,
  multipleQueriesI,
  multipleQueriesIResponse,
  RefreshTokenResponse,
  registerProps,
  reIssueAccessTokenProps,
  ReissuseRefreshTokenResponseI,
  ResponseMessageI,
  sendFriendRequest,
  UpdateProfilePicture,
  UserAuth,
  UserQueryI,
  UserQueryResponseI,
  users,
} from "@/types";
import { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenApi";
import { request } from "../core/request";
import jwt, { JwtPayload } from "jsonwebtoken";

export class Services {
  public static register = (
    registerData: registerProps
  ): CancelablePromise<ResponseMessageI> => {
    return request(OpenAPI, {
      method: "POST",
      url: "/api/users",
      body: registerData,
    });
  };

  public static login = ({
    email,
    password,
  }: Login): CancelablePromise<LoginResponseI> => {
    return request(OpenAPI, {
      method: "POST",
      url: "/api/auth/login",
      responseHeader: ["authorization"],
      body: {
        email,
        password,
      },
    });
  };

  public static getUser = ({
    id,
  }: UserQueryI): CancelablePromise<UserQueryResponseI> => {
    return request(OpenAPI, {
      method: "GET",
      url: "/api/users/{id}",
      path: {
        id,
      },
    });
  };

  public static discoverFriends = ({
    id,
    friendName,
  }: discoverFriendI): CancelablePromise<users> => {
    return request(OpenAPI, {
      method: "GET",
      url: "/api/users/friends/{id}",
      path: { id },
      query: {
        friendName,
      },
      responseHeader: ["authorization"],
    });
  };

  public static sendFriendRequest = ({
    id,
    friendId,
  }: sendFriendRequest): CancelablePromise<ResponseMessageI> => {
    return request(OpenAPI, {
      method: "POST",
      url: "/api/users/send-request/{id}",
      path: {
        id,
      },
      query: {
        friendId,
      },
      responseHeader: ["authorization"],
    });
  };

  public static handleFriendRequest = ({
    id,
    friendId,
    acception,
  }: handleFriendRequestI): CancelablePromise<ResponseMessageI> => {
    return request(OpenAPI, {
      method: "PUT",
      url: "/api/users/friends/{id}",
      path: {
        id,
      },
      query: {
        friendId,
        acception,
      },
      responseHeader: ["authorization"],
    });
  };

  public static updateProfilePicture = ({
    id,
    profileImg,
  }: UpdateProfilePicture): CancelablePromise<ResponseMessageI> => {
    return request(OpenAPI, {
      method: "PUT",
      url: "/api/users/profile-picture/{id}",
      path: {
        id,
      },
      responseHeader: ["authorization"],

      formData: profileImg,
    });
  };

  public static multipleQueries = ({
    id,
    query,
    limit,
    cursor,
  }: multipleQueriesI): CancelablePromise<multipleQueriesIResponse> => {
    return request(OpenAPI, {
      method: "GET",
      url: "/api/users/queries/{id}",
      path: {
        id,
      },
      query: {
        query,
        limit,
        cursor,
      },
      responseHeader: ["authorization"],
    });
  };

  public static CreateOrUpdateAConversation = ({
    id,
    recipientId,
    content,
  }: ConversationUpdatingProps): CancelablePromise<ConversationCreationResponseI> => {
    return request(OpenAPI, {
      method: "POST",
      url: `/api/conversations/{id}`,
      path: {
        id,
      },
      query: {
        recipientId,
      },
      responseHeader: ["authorization"],

      body: {
        content,
      },
    });
  };

  public static logout = ({
    id,
  }: logoutProps): CancelablePromise<ResponseMessageI> => {
    return request(OpenAPI, {
      method: "POST",
      url: "/api/auth/logout/{id}",
      path: {
        id,
      },
    });
  };

  public static checkActiveSession = ({
    friendId,
  }: CheckSessionActiveStatus): CancelablePromise<ResponseMessageI> => {
    return request(OpenAPI, {
      method: "PUT",
      url: "/api/auth/session",
      query: {
        friendId,
      },
      responseHeader: ["authorization"],
    });
  };

  public static GetConversation = ({
    id,
    recipientId,
    cursor,
    limit,
  }: ConversationQuery): CancelablePromise<ConversationUpatingResponseI> => {
    return request(OpenAPI, {
      method: "GET",
      url: `/api/conversations/{id}`,
      path: {
        id,
      },
      query: {
        recipientId,
        cursor,
        limit,
      },
      responseHeader: ["authorization"],
    });
  };
  public static reIssueAccessToken = ({
    id,
  }: reIssueAccessTokenProps): CancelablePromise<RefreshTokenResponse> => {
    return request(OpenAPI, {
      method: "PUT",
      url: "/api/auth/reIssue/{id}",
      path: {
        id,
      },
    });
  };
}

export const LoginApi = async ({ email, password }: Login) => {
  const result = await signIn("credentials", {
    redirect: false,
    email,
    password,
  });

  await signIn("credentials", {
    redirect: false,
  });
  if (!result || result.error) {
    throw new Error(result?.error || "failed");
  }

  return result;
};
