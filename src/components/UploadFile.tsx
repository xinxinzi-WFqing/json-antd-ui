import { Button, message, Upload, UploadFile } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import type { UploadProps } from "antd/es/upload/interface";

export const UploadFileItem = ({
  onChange,
}: {
  onChange: (file: UploadFile) => void;
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
      onChange(undefined);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      onChange(file);
      return false;
    },
    fileList,
  };

  return (
    <Upload {...props} maxCount={1}>
      <Button icon={<UploadOutlined />}>选择文件</Button>
    </Upload>
  );
};

export function fileToBase64(
  file: UploadFile,
  callback: (base64: string) => void,
) {
  const reader = new FileReader();
  reader.onload = function (e) {
    if (typeof e.target.result === "string") {
      callback(e.target.result);
    } else {
      message.error("文件转换失败").then();
    }
  };
  reader.readAsDataURL(file as any);
}
