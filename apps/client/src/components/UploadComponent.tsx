import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import {
  FileUpload,
  FileUploadHeaderTemplateOptions,
  FileUploadSelectEvent,
  FileUploadUploadEvent,
  ItemTemplateOptions,
} from "primereact/fileupload";
import { ProgressBar } from "primereact/progressbar";
import { Button as ButtonPrime } from "primereact/button";
import { Tag } from "primereact/tag";
import { IoIosClose } from "react-icons/io";

import { FaRegFilePdf } from "react-icons/fa6";

import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import "primeflex/primeflex.css"; // flex
import { Box, Button } from "@chakra-ui/react";
import { FaFileUpload } from "react-icons/fa";
import { api } from "../shared/api";
import { AxiosProgressEvent } from "axios";

export default function UploadComponent() {
  const toast = useRef<Toast>(null);
  const [totalSize, setTotalSize] = useState(0);
  const fileUploadRef = useRef<FileUpload>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const onTemplateSelect = (e: FileUploadUploadEvent) => {
    let _totalSize = totalSize;

    for (let i = 0; i < e.files.length; i++) {
      _totalSize += e.files[i].size || 0;
    }

    setTotalSize(_totalSize);
    setFiles(e.files);
  };

  async function handleUpload(event) {
    event.preventDefault();

    setIsUploading(true);

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files[]", file, file.name);
    });
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
      onUploadProgress: function (progressEvent: AxiosProgressEvent) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
        );
        setUploadProgress(percentCompleted);
      },
    };

    await api
      .post("/upload", formData, config)
      .then((response) => {})
      .catch((error) => {
        console.error("Error uploading file: ", error);
      });
    setIsUploading(false);
  }

  const onTemplateUpload = (e: FileUploadUploadEvent) => {
    let _totalSize = 0;
    e.files.forEach((file) => {
      _totalSize += file.size || 0;
    });
    setTotalSize(_totalSize);
  };

  const onTemplateRemove = (file: File, callback: Function) => {
    setTotalSize(totalSize - file.size);
    const filtered = files.filter((f) => f.name !== file.name);
    setFiles(filtered);
    callback();
  };

  const onTemplateClear = () => {
    setTotalSize(0);
  };

  const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
    const { className, chooseButton, cancelButton } = options;
    const value = totalSize / 10000;
    const formatedValue =
      fileUploadRef && fileUploadRef.current
        ? fileUploadRef.current.formatSize(totalSize)
        : "0 B";

    return (
      <div
        className={className}
        style={{
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
        }}
      >
        {chooseButton}
        {cancelButton}
        <div className="flex align-items-center gap-3 ml-auto">
          <span>{formatedValue}</span>

          <Box
            p={3}
            display={"flex"}
            justifyContent="center"
            alignItems="center"
          >
            {value > 0 && (
              <Button
                mx={3}
                leftIcon={<FaFileUpload />}
                onSubmit={handleUpload}
                variant="solid"
                onClick={handleUpload}
                isLoading={isUploading}
              >
                Upload
              </Button>
            )}

            {isUploading && (
              <ProgressBar
                value={uploadProgress}
                showValue={true}
                style={{ width: "10rem", height: "12px" }}
              ></ProgressBar>
            )}
          </Box>
        </div>
      </div>
    );
  };

  const itemTemplate = (inFile: object, props: ItemTemplateOptions) => {
    const file = inFile as File;
    return (
      <div className="flex align-items-center flex-wrap">
        <div className="flex align-items-center" style={{ width: "40%" }}>
          <Box p={3}>
            <FaRegFilePdf />
          </Box>
          <span className="flex flex-column text-left ml-3">
            {file.name}
            <small>{new Date().toLocaleDateString()}</small>
          </span>
        </div>
        <ButtonPrime
          type="button"
          icon="pi pi-times"
          className="p-button-outlined p-button-rounded p-button-danger ml-auto"
          onClick={() => onTemplateRemove(file, props.onRemove)}
        />
      </div>
    );
  };

  const emptyTemplate = () => {
    return (
      <div className="flex align-items-center flex-column">
        <i
          className="pi pi-image mt-3 p-5"
          style={{
            fontSize: "5em",
            borderRadius: "50%",
            backgroundColor: "var(--surface-b)",
            color: "var(--surface-d)",
          }}
        ></i>
        <span
          style={{ fontSize: "1.2em", color: "var(--text-color-secondary)" }}
          className="my-5"
        >
          Arraste e solte arquivos
        </span>
      </div>
    );
  };

  const chooseOptions = {
    icon: "pi pi-fw pi-images",
    iconOnly: true,
    className: "custom-choose-btn p-button-rounded p-button-outlined",
  };

  const cancelOptions = {
    icon: "pi pi-fw pi-times",
    iconOnly: true,
    className:
      "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined",
  };

  return (
    <div>
      <PrimeReactProvider>
        <Toast ref={toast}></Toast>

        <FileUpload
          ref={fileUploadRef}
          name="demo[]"
          url="/api/upload"
          multiple
          accept="application/pdf"
          maxFileSize={1000000}
          onUpload={onTemplateUpload}
          onSelect={onTemplateSelect}
          onError={onTemplateClear}
          onClear={onTemplateClear}
          headerTemplate={headerTemplate}
          itemTemplate={itemTemplate}
          emptyTemplate={emptyTemplate}
          chooseOptions={chooseOptions}
          // uploadOptions={uploadOptions}
          cancelOptions={cancelOptions}
        />
      </PrimeReactProvider>
    </div>
  );
}
