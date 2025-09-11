import { z } from "zod";

import * as Yup from "yup";

import { File } from "buffer";
import { genders } from "./constants";

export const userSchema = z.object({
  email: z
    .string()
    .min(1, "email is required")
    .email({ message: "invaild email address" }),
  password: z.string().min(6, "please enter password"),
});

export const messageSchema = z.object({
  content: z
    .string()
});

export const RegisterSchema = z
  .object({
    full_name: z
      .string("username is required")
      .min(2, "username must be at least 2 characters."),

    email: z.email().min(1, "email is required"),

    password: z.string().min(6, "Password must be at least 6 characters."),
    passwordConfirm: z.string({ message: "password confirm is required" }),
    gender: z.enum(genders, { message: "please select a gender" }),
    birthDate: z
      .date({ message: "please select your birth date" })
      .refine((data) => data.getTime() < Date.now(), {
        error: "birth date must be in past",
      }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "password must match",
  });

export const discoverSchema = z.object({
  friendName: z
    .string({ message: "name is required to generate a search" })
    .min(1, "name is required to generate a search"),
});
const validImageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];

export const UpdateUserSchema = z.object({
  profileImg: z
    .custom<File[]>(
      (files) => {
        return Array.isArray(files) && files.length > 0;
      },
      {
        message: "Please select an Image",
      }
    )
    .refine(
      (files) => {
        if (!Array.isArray(files) || files.length === 0) {
          return false;
        }
        return files.every((file) => {
          const fileName = file.name.toLowerCase();
          const extension = fileName.split(".").pop();
          return validImageExtensions.includes(extension || "");
        });
      },
      { message: "please select a valid image " }
    )
    .refine(
      (files) =>
        Array.isArray(files) && files.length > 0 && files[0].size <= 1000000,
      {
        message: "picture size must be smaller than or equal to 1MB",
      }
    ),
});

export const profilePictureSchema = z.object({
  profilePicture: z
    .custom<File[]>((files) => Array.isArray(files) && files.length > 0, {
      message: "Please select an image",
    })
    .refine(
      (files) =>
        files.every((file) => {
          const fileName = file.name.toLowerCase();
          const extension = fileName.split(".").pop();
          return validImageExtensions.includes(extension || "");
        }),
      { message: "Invalid image extension" }
    )
    .refine(
      (files) =>
        Array.isArray(files) && files.length > 0 && files[0].size <= 1500000,
      {
        message: "picture size must be smaller than or equal to 1.5MB",
      }
    ),
});

export const VerifyOtp = z.object({
  otp: z.string({ message: "otp is required" }).min(8, "otp is required"),
});


export const AccountSchema = z.object({
    name: z.string().optional(),
    gender: z.string().optional(),
});