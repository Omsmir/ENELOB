"use client";
import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { MotionComponent, Motions } from "./relatedComponents/Motion";
const LoginForm = dynamic(() => import("./LoginForm"));

const Login = () => {
  return (
    <MotionComponent form={Motions.FADEIN}>
      <main className=" min-h-screen h-screen flex justify-center items-center dark:bg-[var(--sidebar-accent)]">
        <div className="sub-container max-w-[686px] ">
          <LoginForm />
        </div>
        <Image
          src="/assets/images/login.jpg"
          loading="lazy"
          alt="Cover"
          height={1000}
          width={1000}
          className="side-img max-w-[60%] object-center object-cover"
        />
      </main>
    </MotionComponent>
  );
};

export default Login;
