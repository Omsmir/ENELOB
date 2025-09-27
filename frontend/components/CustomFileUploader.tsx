"use client";
import { Upload, UploadFile, Image, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { Fragment, useState } from "react";
import { cn, FileType, getBase64 } from "@/lib/utils";
import ImgCrop from "antd-img-crop";
import { Button } from "./ui/button";
import Img from "next/image";
import { MainLayoutHook } from "./context/LayoutContext";
export enum FileUploaderType {
  PICTURE = "picture",
  JSON = "json",
  COVER = "cover",
}

type CustomFileUploaderProps<T = File[]> = {
  files?: T;
  onChange: (files: T) => void;
  classname?: string;
  buttonTitle?: string;
  plusIcon?: boolean;
  buttonClassName?: string;
  type: FileUploaderType;
  fieldUploadType?: FileUploaderType;
  maxCount?: number;
  name?: string;
};

const RenderUploader = ({ props }: { props: CustomFileUploaderProps<any> }) => {
  switch (props.type) {
    case FileUploaderType.PICTURE:
      return (
        <PictureUploader
          files={props.files as File[]}
          onChange={props.onChange as (files: File[]) => void}
          classname={props.classname}
          buttonTitle={props.buttonTitle}
          plusIcon={props.plusIcon}
          buttonClassName={props.buttonClassName}
          type={FileUploaderType.PICTURE}
          fieldUploadType={props.fieldUploadType}
        />
      );

    default:
      return null;
  }
};

const PictureUploader: React.FC<CustomFileUploaderProps<File[]>> = ({
  files = [],
  onChange,
  classname,
  buttonTitle,
  plusIcon,
  buttonClassName,
  fieldUploadType,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const { setPreviewCover, setFilesLength } = MainLayoutHook();

  const fileList: UploadFile[] = files
    ? files.map((file, index) => ({
        uid: String(index),
        name: file.name,
        status: "done",
        originFileObj: file as any,
      }))
    : [];

  const handleUploadChange = ({ fileList }: { fileList: UploadFile[] }) => {
    const updatedFiles = fileList.map((file) => file.originFileObj as File);

    onChange(updatedFiles);

    setFilesLength(updatedFiles.length);

    if (fieldUploadType === FileUploaderType.COVER) {
      setPreviewCover(
        updatedFiles[0] ? URL.createObjectURL(updatedFiles[0]) : undefined
      );
    }

    fileList.map((file) => {
      if (file.status === "done") {
        message.success(`${file.name} file uploaded successfully`);
      } else if (file.status === "error") {
        message.error(`${file.name} file upload failed.`);
      }
    });
  };

  const uploadButton = (
    <button
      style={{ border: 0, background: "none" }}
      type="button"
      className={cn("dark:text-slate-50", buttonClassName)} // styling is in globals.css
    >
      {plusIcon && <PlusOutlined />}
      <div style={{ marginTop: 8 }}>{buttonTitle || "Upload"}</div>
    </button>
  );

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));

    setPreviewOpen(true);
  };

  switch (fieldUploadType) {
    case FileUploaderType.COVER:
      return (
        <div
          className={cn(
            "flex justify-end items-end w-full absolute h-[300px] z-10",
            classname
          )}
        >
          <Upload
            fileList={fileList}
            beforeUpload={() => false}
            onChange={handleUploadChange}
            onPreview={handlePreview}
            maxCount={1}
          >
            {fileList.length < 1 && (
              <div className="flex ">
                <Button
                  type="button"
                  className="cursor-pointer bg-transparent hover:bg-transparent hover:text-slate-200 lowercase "
                >
                  {buttonTitle || "change cover"}
                </Button>
              </div>
            )}
          </Upload>
        </div>
      );
    case FileUploaderType.PICTURE:
      return (
        <React.Fragment>
          <div className={cn("flex w-full", classname)}>
            <ImgCrop rotationSlider>
              <Upload
                fileList={fileList}
                listType="picture-circle"
                beforeUpload={() => false}
                onChange={handleUploadChange}
                onPreview={handlePreview}
                maxCount={1}
              >
                {fileList.length < 1 && uploadButton}
              </Upload>
            </ImgCrop>
          </div>
          {previewImage && (
            <Image
              wrapperStyle={{ display: "none" }}
              alt="preview"
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}
        </React.Fragment>
      );
    default:
      throw new Error("Unsupported field upload type");
  }
};

const CustomFileUploader = (props: CustomFileUploaderProps<any>) => {
  return <RenderUploader props={props} />;
};
export default CustomFileUploader;
