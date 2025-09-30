import { file, z } from "zod";
import { genders } from "./constants";
import { getImageSize } from "./utils";

export const userSchema = z.object({
  email: z
    .email({ message: "invaild email address" })
    .min(1, "email is required"),
  password: z.string().min(6, "please enter password"),
});

export const messageSchema = z.object({
  content: z
    .string({ message: "message required" })
    .min(1, "message can't be empty"),
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
  gender: z.enum(genders).optional(),
  olderThan: z.date().optional(),
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

export const coverImageSchema = z.object({
  coverImg: z
    .custom<File[]>(
      (files) => {
        return Array.isArray(files) && files.length > 0;
      },
      {
        message: "Please select cover image",
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
      { error: "please select a valid image" }
    )
    .refine(
      (files) =>
        Array.isArray(files) && files.length > 0 && files[0].size <= 5000000,
      {
        message: "Cover image size must be smaller than or equal to 5MB",
      }
    )
    .superRefine(async (files, ctx) => {
      if (!Array.isArray(files) || files.length === 0) {
        return;
      }
      try {
        const { width, height } = await getImageSize(files[0]);
        if (width < 1100 || height < 300) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "cover image dimensions must be at least 1200x300 pixels",
          });
        }
      } catch (error) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "unable to process the image. please try another image",
        });
      }
    }),
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

export const changePicturesSchema = z.object({
  profileImg: profilePictureSchema.shape.profilePicture.optional(),
  coverImg: coverImageSchema.shape.coverImg.optional(),
});

export const VerifyOtp = z.object({
  otp: z.string({ message: "otp is required" }).min(8, "otp is required"),
});

export const AccountSchema = z.object({
  full_name: z.string().optional(),
  gender: z.string().optional(),
});
