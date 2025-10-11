import { users, usersDiscoverd } from "@/types";

export type state = "add" | "remove" | "accept";

export interface handleFriendAdditionProps {
  friendId: string;
  state: state;
  id: string;
  setUpdatedFriend?: (value: React.SetStateAction<usersDiscoverd>) => void;
  setUpdatedUsers?: React.Dispatch<React.SetStateAction<users | undefined>>;
  addRemoveFriendHandler: () => Promise<void>;
}

export const handleFriendAddition = async ({
  friendId,
  state,
  id,
  setUpdatedFriend,
  addRemoveFriendHandler,
  setUpdatedUsers,
}: handleFriendAdditionProps) => {
  addRemoveFriendHandler();

  switch (state) {
    case "add":
      if (setUpdatedFriend) {
        setUpdatedFriend((user) =>
          user.user._id === friendId ? { ...user, sendRequestId: id } : user
        );
      } else if (setUpdatedUsers) {
        setUpdatedUsers(
          (prev) =>
            prev &&
            prev.map((user) =>
              user.user._id === friendId ? { ...user, sendRequestId: id } : user
            )
        );
      }
      break;
    case "remove":
      if (setUpdatedFriend) {
        setUpdatedFriend((user) =>
          user.user._id === friendId
            ? { ...user, sendRequestId: null, userId: null }
            : user
        );
      } else if (setUpdatedUsers) {
        setUpdatedUsers(
          (prev) =>
            prev &&
            prev.map((user) =>
              user.user._id === friendId
                ? { ...user, sendRequestId: null, userId: null }
                : user
            )
        );
      }
      break;

    case "accept":
      if (setUpdatedFriend) {
        setUpdatedFriend((user) =>
          user.user._id === friendId
            ? { ...user, friendRequest: null, userId: id }
            : user
        );
      } else if (setUpdatedUsers) {
        setUpdatedUsers(
          (prev) =>
            prev &&
            prev.map((user) =>
              user.user._id === friendId
                ? { ...user, friendRequest: null, userId: id }
                : user
            )
        );
      }
      break;
  }
};
