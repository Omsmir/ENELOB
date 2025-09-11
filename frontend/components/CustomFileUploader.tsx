"use client";
import { Upload, UploadFile, Image } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { cn, FileType, getBase64 } from "@/lib/utils";
import ImgCrop from "antd-img-crop";

export enum FileUploaderType {
  PICTURE = "picture",
  JSON = "json",
}

type CustomFileUploaderProps<T = File[]> = {
  files?: T;
  onChange: (files: T) => void;
  classname?: string;
  buttonTitle?: string;
  plusIcon?: boolean;
  buttonClassName?: string;
  type: FileUploaderType;
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
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
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

    console.log(updatedFiles); // should show Blob of cropped image

    onChange(updatedFiles);
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


  return (
    <React.Fragment>
      <div className={cn("flex w-full", classname)}>
        <ImgCrop rotationSlider  >
          <Upload
            fileList={fileList}
            listType="picture-circle"
            beforeUpload={() => false}
            onChange={handleUploadChange}
            onPreview={handlePreview}
            maxCount={1}
          >
            {fileList.length >= 1 ? null : uploadButton}
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
};

const CustomFileUploader = (props: CustomFileUploaderProps<any>) => {
  return <RenderUploader props={props} />;
};
export default CustomFileUploader;
