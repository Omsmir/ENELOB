"use client";
import ErrorComponent from "@/components/ErrorComponent";
import Spinner, { ReusableSpinner } from "@/components/Spinner";
import { GroupMessageResponse, multipleQueriesIResponse } from "@/types";
import React, { Fragment } from "react";
import SingleMessageLayout from "./conversation/singleMessage/SingleMessageLayout";
import { ArrowDown } from "lucide-react";
import SingleChat from "./Chats/SingleChat";
import MoreButton from "./MoreButton";

interface ConversationReusableLayoutProps {
  pages?: GroupMessageResponse | [];
  friends?: multipleQueriesIResponse[] | undefined;
  isFetching: boolean;
  isFetchingNextOrPreviousPage: boolean;
  hasNextOrPerviousPage?: boolean;
  moreButton?: boolean;
  isError: boolean;
  scrollBottomState?: boolean;
  error: Error | null;
  eventHandler?: () => void;
  spinnerClassname?: string;
  moreButtonTitle?: string;
}
const ConversationReusableLayout = ({
  pages,
  friends,
  isFetching,
  isError,
  isFetchingNextOrPreviousPage,
  hasNextOrPerviousPage,
  moreButton,
  moreButtonTitle,
  scrollBottomState,
  error,
  eventHandler,
  spinnerClassname,
}: ConversationReusableLayoutProps) => {
  return (
    <Fragment>
      {isFetching && !isFetchingNextOrPreviousPage ? (
        <Spinner className="flex" size="default" />
      ) : isError ? (
        <ErrorComponent isError={isError} error={error} />
      ) : pages && pages.length > 0 ? (
        pages.map((page, index) => (
          <SingleMessageLayout group={page} key={index} />
        ))
      ) : (
        friends &&
        friends.length > 0 &&
        friends.map((pageOfFriends) =>
          pageOfFriends.users.map((friend, index) => (
            <SingleChat friend={friend} key={index} />
          ))
        )
      )}
      {scrollBottomState && (
        <span
          onClick={eventHandler}
          className="flex justify-center items-center fixed right-10 bottom-30 dark:bg-slate-900 bg-white size-12 rounded-full cursor-pointer transition-colors hover:bg-slate-50 "
        >
          <ArrowDown />
        </span>
      )}
      <ReusableSpinner
        isLoading={isFetchingNextOrPreviousPage}
        className={`${spinnerClassname}`}
        text="loading"
        size="default"
      />
      {moreButton && (
        <MoreButton
          hasPreviousOrNextPage={hasNextOrPerviousPage}
          isFetching={isFetching}
          handleNextOrPerviousPage={eventHandler}
          isFetchingNextOrPerviousPage={isFetchingNextOrPreviousPage}
          title={moreButtonTitle}
        />
      )}
    </Fragment>
  );
};

export default ConversationReusableLayout;
