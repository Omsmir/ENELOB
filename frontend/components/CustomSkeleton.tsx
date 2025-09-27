import { cn } from "@/lib/utils";
import { Image, Skeleton } from "antd";
import React, { useEffect } from "react";
import Img from "next/image";
import { useSession } from "./store/slices/AuthReducer";

export enum SkeletonType {
  HEAD = "h1",
  PARAGRAPH = "p",
  AVATAR = "avatar",
  INPUT = "input",
  COVER = "cover",
}
interface CustomSkeletonProps {
  classname?: string;
  innerText?: string | undefined;
  SkeletonType: SkeletonType;
  loading: boolean;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  src?: string;
  width?: number;
  height?: number;
  size?: number;
  shape?: "circle" | "square";
}

const RenderSkeleton = ({ props }: { props: CustomSkeletonProps }) => {
  const { session } = useSession();
  const { setLoading } = props;

  const setHandler = () => {
    if (setLoading) {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (setLoading) {
        setLoading(false);
      }
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [props.loading]);
  console.log(props.loading);
  switch (props.SkeletonType) {
    case SkeletonType.HEAD:
      return (
        <h1 className={cn("relative", props.classname)}>
          {props.loading ? (
            <Skeleton
              active={props.loading}
              title={{ width: "100%" }}
              paragraph={{ rows: 0 }}
              style={{ width: "100%" }}
              className="absolute"
            />
          ) : (
            <span className={`relative block  w-full `}>{props.innerText}</span>
          )}
        </h1>
      );
    case SkeletonType.AVATAR:
      return (
        <span
          className={cn(
            "relative border overflow-hidden cursor-pointer",
            props.classname
          )}
        >
          {props.loading && (
            <Skeleton.Avatar
              active={props.loading}
              size={props.size}
              shape={props.shape}
              className="absolute inset-0"
            />
          )}
          <Image
            width={props.width}
            height={props.height}
            src={props.src || "/assets/images/dr-cameron.png"}
            loading="lazy"
            alt="avatar"
            className="w-full h-full object-cover object-center "
          />
        </span>
      );
    case SkeletonType.COVER:
      return (
        <span className={cn("relative overflow-hidden", props.classname)}>
          {props.loading ? (
            <Skeleton.Node
              active={props.loading}
              style={{ height: 300 }}
              className="!w-full"
            />
          ) : (
            <Img
              width={props.width || 1200}
              height={props.height || 1200}
              alt="coverHolder"
              onLoad={setHandler}
              src={props.src || "/assets/images/placeholder.jpg"}
              className={`flex w-full object-cover object-center rounded-b-md h-[300px] `}
            />
          )}
        </span>
      );
    default:
      return null;
  }
};
const CustomSkeleton = (props: CustomSkeletonProps) => {
  return <RenderSkeleton props={props} />;
};

export default CustomSkeleton;
