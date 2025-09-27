import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { Services } from "./sdk.gen";
import {
  ConversationQuery,
  discoverFriendI,
  multipleQueriesI,
  UserQueryI,
} from "@/types";

export class Queries {
  public static UseDiscoverFriends = ({ id, friendName,gender,olderThan }: discoverFriendI) => {
    return useQuery({
      queryFn: () => Services.discoverFriends({ id, friendName ,gender,olderThan}),
      queryKey: ["friendsDiscovered", `${friendName}-${gender ?? ""}-${olderThan ?? ""}`],
      enabled: !!friendName,
    });
  };

  public static useMultipleQueries = ({
    id,
    query,
    limit,
  }: multipleQueriesI) => {
    return useInfiniteQuery({
      queryFn: async ({ pageParam }: { pageParam?: string | null }) => {
        // artificial delay (e.g. 800ms)
        await new Promise((resolve) => setTimeout(resolve, 300));

        return Services.multipleQueries({
          id,
          query,
          limit,

          cursor: pageParam ?? null,
        });
      },
      queryKey: [`multipleQueries-${query}`],
      initialPageParam: null,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
      placeholderData: keepPreviousData,
      retry: 1,
    });
  };

  public static useGetMessages = ({ id, recipientId }: ConversationQuery) => {
    return useInfiniteQuery({
      queryFn: async ({ pageParam }: { pageParam?: string | null }) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return Services.GetConversation({
          id,

          recipientId,
          cursor: pageParam ?? null,
          limit: 10,
        });
      },
      queryKey: [`conversation-${recipientId}`],
      staleTime: 0,
      initialPageParam: null,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
      getPreviousPageParam: (firstPage) => firstPage.prevCursor ?? null,
      retry: 1,
    });
  };

  public static useGetUser = ({ id,friendId }: UserQueryI) => {
    return useQuery({
      queryKey: [`user-${id}`],
      queryFn: () => Services.getUser({ id ,friendId}),
    });
  };
}
