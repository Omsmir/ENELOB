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

  public static discoverFriends = ({
    id,
    friendName,
    accessToken,
    refreshToken,
  }: discoverFriendI): CancelablePromise<users> => {
    return request(OpenAPI, {
      method: "GET",
      url: "/api/users/friends/{id}",
      path: { id },
      query: {
        friendName,
      },
      headers: {
        Authorization: accessToken,
        "x-refresh": refreshToken,
      },
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
    });
  };
  public static refreshAccessToken = async ({
    id,
    refreshToken: rf,
  }: reIssueAccessTokenProps): Promise<ReissuseRefreshTokenResponseI> => {
    const getResponse = (): CancelablePromise<RefreshTokenResponse> => {
      return request(OpenAPI, {
        method: "GET",
        url: "/api/auth/reIssue/{id}",
        path: {
          id,
        },
        headers: {
          "x-refresh": rf,
        },
      });
    };

    const { refreshToken, accessToken, sessionState } = await getResponse();

    if (!accessToken) throw new Error("no access Token");

    const decodedToken = jwt.decode(accessToken) as JwtPayload;

    return {
      accessToken: accessToken,
      email: decodedToken?.email,
      expiresAt: decodedToken?.exp && decodedToken.exp * 1000,
      id: decodedToken?._id,
      name: decodedToken?.full_name,
      profileImg: decodedToken?.profileImg.url,
      verified: decodedToken?.verified,
      refreshToken: refreshToken,
    };
  };
}

export const LoginApi = async ({ email, password }: Login) => {
  const result = await signIn("credentials", {
    redirect: false,
    email,
    password,
  });

  if (!result || result.error) {
    throw new Error(result?.error || "failed");
  }

  return result;
};
