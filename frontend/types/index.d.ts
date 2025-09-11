import NextAuth, { DefaultProfile, DefaultUser } from "next-auth";

declare interface ConstructedLayoutProps {
  children: React.ReactNode;
}

declare type theme = "github-dark" | "vitesse-dark" | "nord";



declare type registerProps = {
  full_name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  gender: string;
  birthDate: Date;
};

declare type LoginResponseI = {
  accessToken: string;
  message:string
};
declare type Login = {
  email: string;
  password: string;
};

declare type RegisterPropsI = {
  email: string;
  full_name: string;
  password: string;
  passwordConfirm: string;
};
declare type ResponseMessageI = {
  message: string;
};

declare type sendFriendRequest = {
  id: string;
  friendId: string;
};

declare type User = {
  _id: string;
  lastSeenAt: Date;
  full_name: string;
  verified?: boolean;
  email: string;
  gender:string;
  profileImg?: {
    url: string;
  };
  isActive: string[];
  friendRequests: string[];
  friends: string[];
  sendRequests: string[];
  createdAt:Date;
  updatedAt:Date;

};



declare type UserQueryI = {
  id:string
}
declare type UserQueryResponseI = {
  user:User
}


declare type UserAuth = {
  _id: string;
  lastSeenAt: Date | undefined;
  full_name: string;
  verified?: boolean;
  email: string;
  profileImg?:string;
  accessToken: string;

  expiresAt: number | undefined;
  [key: string]: any;
};

declare type discoverFriendI = {
  id: string;
  friendName: string;
};

declare type handleFriendRequestI = {
  id: string;
  friendId: string;
  acception?: string;
};

declare type UpdateProfilePicture = {
  profileImg: FormData;
  id: string;
};

declare type multipleQueriesI = {
  id: string;
  query: "friends" | "friendRequests" | "sendRequests";
  limit: number;
  cursor?: string | null;
};
declare type multipleQueriesIResponse = {
  users: User[];
  nextCursor: string;
};
declare type reIssueAccessTokenProps = {
  id: string;

};

declare type RefreshTokenResponse = {
  message:string;
  sessionState: boolean;
};

declare type ReissuseRefreshTokenResponseI = {
  _id: string;
  lastSeenAt: Date;
  full_name: string;
  verified?: boolean;
  email: string;
  profileImg?:string
  accessToken: string;
  expiresAt: number | undefined;
};

declare type users = {
  userId: string | null;
  sendRequestId: string | null;
  user: User;
}[];

declare type usersDiscoverd = {
  userId: string | null;
  sendRequestId: string | null;
  user: User;
};

declare type ConversationUpdatingProps = {
  id: string;
  content: string;
  recipientId: string;
};
declare type ConversationQuery = {
  id: string;
  recipientId: string;
  cursor?: string | null;
  limit?: number;
};

declare type Message = {
  _id: string;
  userId: string;
  content?: string;
  images?: [];
  seen: boolean;
  sentAt: Date;
};

declare type ConversationUpatingResponseI = {
  messages: Message[];
  nextCursor?: string;
  prevCursor: string;
  count: number;
};

declare type ConversationCreationResponseI = {
  count: number;
};

declare interface ObjectType {
  public: {
    title: string;
    tone: string;
  };
  message: {
    title: string;
    tone: string;
  };
}

declare type tone = "message" | "system";

declare type GroupMessageResponse = {
  userId: string;
  sentAt: Date;
  messages: typeof messages;
}[];

declare type logoutProps = {
  id: string;
};

declare type CheckSessionActiveStatus = {
  friendId: string;
};
