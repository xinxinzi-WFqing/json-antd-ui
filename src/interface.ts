import * as React from "react";

type JsonValue = string | number | boolean | null | JsonArray | JsonObject;

interface JsonArray extends Array<JsonValue> {}

export interface JsonObject {
  [key: string]: JsonValue;
}

export enum KeyDescType {
  Time = "time",
  Date = "date",
  Link = "link",
  Image = "image",
  PDF = "pdf",
  JSONString = "JSONString",
  Select = "select",
}

export enum PrimitiveType {
  String = "string",
  Number = "number",
  Boolean = "boolean",
  Object = "object",
  Array = "array",
}

export type KeyDescription = {
  key: string;
  description?: string;
  // 显示顺序 越大越靠前 可以为负数
  index?: number;
  // 是否显示
  hidden?: boolean;
  onChange?: (
    value: any,
    path: (string | number)[],
    beforeAll: any,
    ...args: any[]
  ) => void | boolean;
} & (
  | {
      type?: KeyDescType.Link;
      // 属性
      props?: {
        copyable?: boolean;
      };
    }
  | {
      type?: KeyDescType.Image;
      // 属性
      props?: {
        width?: string;
        height?: string;
      };
    }
  | {
      type?: KeyDescType.Time | KeyDescType.Date;
      // 属性
      props?: {
        format?: string;
      };
    }
  | {
      type?: KeyDescType.PDF;
      // 属性
      props?: {
        width?: string;
        height?: string;
        type?: "base64" | "url";
      };
    }
  | {
      type?: PrimitiveType.String;
      // 属性
      props?: {
        copyable?: boolean;
        ellipsis?: {
          length: number;
        };
      };
    }
  | {
      type?: PrimitiveType.Boolean;
      // 属性
      props?: {
        checkedChildren?: React.ReactNode;
        unCheckedChildren?: React.ReactNode;
      };
    }
  | {
      type?: KeyDescType.JSONString;
      props?: {};
    }
  | {
      type?: KeyDescType.Select;
      props?: {
        options: {
          label: string;
          value: string;
        }[];
      };
    }
);

export interface DisplayJSONProps<T extends JsonObject> {
  // 任意类型的数据
  data: T;
  allData: T;
  // key的解释
  keyDescriptions?: KeyDescription[];
  title?: string;
  // 默认全部展开折叠面板 list bool
  defaultActiveKey?: boolean;
  onChange?: (value: T) => void;
}
