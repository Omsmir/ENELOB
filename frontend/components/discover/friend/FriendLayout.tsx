"use client";

import { Queries } from "@/actions/queries";
import Spinner from "@/components/Spinner";
import { useSession } from "@/components/store/slices/AuthReducer";
import Profile from "./Profile";
import {
  MotionComponent,
  Motions,
} from "@/components/relatedComponents/Motion";
import IntrinsicSettingLayout from "@/components/dashboard/IntrinsicSettingLayout";
import { usersDiscoverd } from "@/types";

const FriendLayout = ({ id }: { id: string }) => {
  const { session } = useSession();
  const { data, isFetching, isError, error } = Queries.useGetUser({
    id: session._id,
    friendId: id,
  });
  return (
    <MotionComponent className="w-full pt-16 h-screen" form={Motions.FADEIN}>
      <div className="grid grid-cols-12 w-full pt-0 px-4 pb-6">
        <IntrinsicSettingLayout title="friend profile" classname="mb-8 ">
          {isFetching ? (
            <Spinner size="default" className="col-span-12  w-full" />
          ) : isError ? (
            <div className="flex justify-center items-center">
              <h1 className="font-medium capitalize">{error.message}</h1>
            </div>
          ) : (
            data &&
            data.user && <Profile friend={data.user as usersDiscoverd} />
          )}
        </IntrinsicSettingLayout>
      </div>
    </MotionComponent>
  );
};

export default FriendLayout;
