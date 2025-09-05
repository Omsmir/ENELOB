"use client";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/overlayscrollbars.css";
import React, { useEffect, useState } from "react";
import SingleCard from "./SingleCard";
import {
  ResponseMessageI,
  User,
  usersDiscoverd,
  users,
} from "@/types";
import Loading from "@/app/loading";
import { useSession } from "next-auth/react";
import { Queries } from "@/actions/queries";
import Spinner from "../Spinner";

type CardsLayoutProps = {
  users?: users;
  isFetching: boolean;
  error: Error | null;
  isError: boolean;
};

const CardsLayout = ({
  users,
  isFetching,
  error,
  isError,
}: CardsLayoutProps) => {
  const { data: session } = useSession();

  const [updatedUsers, setUpdatedUsers] = useState<
    users | undefined
  >(users);

  useEffect(() => {
    setUpdatedUsers(users);
  }, [isFetching]);

  console.log(users)
    return (
      <OverlayScrollbarsComponent className="col-span-12 lg:col-span-8 " defer>
        <div className="grid grid-cols-12 max-h-screen gap-4 p-4">
          {isFetching ? (
            <Spinner
              size="default"
              text="searching"
              className="grid col-span-12 content-center"
            />
          ) : isError ? (
            <div className="flex justify-center items-center col-span-12 h-screen">
              <h1 className="font-bold capitalize">{error?.message}</h1>
            </div>
          ) : updatedUsers && updatedUsers.length > 0 ? (
            updatedUsers.map((user, index) => (
              <SingleCard
                setUpdatedUsers={setUpdatedUsers}
                user={user}
                key={index}
              />
            ))
          ) : (
            <div className="flex justify-center items-center col-span-12 h-screen">
              <h1 className="font-bold capitalize">Discover more friends</h1>
            </div>
          )}
        </div>
      </OverlayScrollbarsComponent>
    );
};

export default CardsLayout;
