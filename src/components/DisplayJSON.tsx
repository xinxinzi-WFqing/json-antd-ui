import React, { FC } from "react";
import {
  Descriptions,
  Collapse,
  List,
  Typography,
  Button,
  Badge,
  Modal,
  Card,
  Image,
} from "antd";
import CodeMirror from "@uiw/react-codemirror";
import { quietlight } from "@uiw/codemirror-theme-quietlight";
import { jsonLanguage } from "@codemirror/lang-json";
import dayjs from "dayjs";
const { Panel } = Collapse;

const keyDescriptionsContext = React.createContext<KeyDescription[]>([]);

export enum KeyDescType {
  Time = "time",
  Date = "date",
  Link = "link",
  Image = "image",
  PDF = "pdf",
}

enum PrimitiveType {
  String = "string",
  Number = "number",
  Boolean = "boolean",
  Object = "object",
  Array = "array",
}

export type KeyDescription = {
  key: string;
  description: string;
  // 显示顺序 越大越靠前 可以为负数
  index?: number;
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
      };
    }
  | {
      type?: PrimitiveType.String;
      // 属性
      props?: {
        copyable?: boolean;
      };
    }
);

interface DisplayJSONProps {
  // 任意类型的数据
  data: Record<string, any> | Record<string, any>[];
  // key的解释
  keyDescriptions?: KeyDescription[];
  title?: string;
  // 默认全部展开折叠面板 list bool
  defaultActiveKey?: boolean;
}

const Item = ({
  keyDescription,
  description,
  value,
  defaultActiveKey,
}: {
  keyDescription: KeyDescription;
  description: string;
  value: any;
  defaultActiveKey: boolean;
}) => {
  const getPrimitiveType = (data) => {
    if (typeof data === "object") {
      if (Array.isArray(data)) {
        return PrimitiveType.Array;
      } else {
        return PrimitiveType.Object;
      }
    } else {
      return typeof data;
    }
  };

  const primitiveType = getPrimitiveType(value);
  const type = keyDescription?.type || primitiveType;
  const props = (keyDescription?.props as any) || {};

  const itemMap = new Map<typeof type, React.ReactNode>([
    [
      PrimitiveType.String,
      <Typography.Text copyable={props.copyable}>{value}</Typography.Text>,
    ],
    [
      PrimitiveType.Number,
      <Typography.Text copyable={props.copyable}>{value}</Typography.Text>,
    ],
    [
      PrimitiveType.Boolean,
      value ? (
        <Badge status="success" text="是" />
      ) : (
        <Badge status="error" text="否" />
      ),
    ],
    [
      PrimitiveType.Object,
      <DisplayJSONItem
        data={value}
        defaultActiveKey={defaultActiveKey}
        title={description}
        isFirst={false}
      />,
    ],
    [
      PrimitiveType.Array,
      <DisplayJSONItem
        data={value}
        defaultActiveKey={defaultActiveKey}
        title={description}
        isFirst={false}
      />,
    ],
    [
      KeyDescType.Time,
      dayjs(value).format(props.format || "YYYY-MM-DD HH:mm:ss"),
    ],
    [KeyDescType.Date, dayjs(value).format(props.format || "YYYY-MM-DD")],
    [
      KeyDescType.Link,
      <a href={value} target="_blank">
        {value}
      </a>,
    ],
    [
      KeyDescType.Image,
      <Image
        src={value}
        alt={description}
        style={{
          maxWidth: "100%",
          width: props.width || "auto",
          height: props.height || "auto",
          objectFit: "cover",
        }}
      />,
    ],
    [
      KeyDescType.PDF,
      // iframe
      <iframe
        src={value}
        style={{
          width: props.width || "100%",
          height: props.height || "500px",
        }}
      />,
    ],
  ]);

  return itemMap.get(type);
};

const DisplayJSONItem = ({
  data,
  isFirst,
  title = "",
  defaultActiveKey = true,
  extra,
}: DisplayJSONProps & {
  isFirst: boolean;
  extra?: React.ReactNode;
}) => {
  const keyDescriptions = React.useContext(keyDescriptionsContext);
  const isArray = Array.isArray(data);
  // 获取 data 深度
  const getDepth = (data) => {
    if (typeof data !== "object") {
      return 0;
    }
    let depth = 0;
    for (let key in data) {
      const item = data[key];
      if (typeof item === "object" && Object.keys(item).length > 0) {
        const itemDepth = getDepth(item) + 1;
        if (itemDepth > depth) {
          depth = itemDepth;
        }
      }
    }
    return depth;
  };
  const depth = getDepth(data);
  // 如果是数组，使用 Collapse 展示
  if (isArray) {
    // 判断是对象数组还是基本类型数组
    const isObjectArray = data.some((item) => typeof item === "object");
    if (!isObjectArray) {
      return (
        <List
          size={"small"}
          bordered
          dataSource={data}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      );
    } else {
      return (
        <Collapse
          // 默认全部展开
          defaultActiveKey={data.map((index) => `${index}`)}
          items={data.map((item, index) => ({
            label: `${title}   ${index + 1}`,
            key: `${index}`,
            children: (
              <DisplayJSONItem
                data={item}
                defaultActiveKey={defaultActiveKey}
                isFirst={false}
              />
            ),
          }))}
        ></Collapse>
      );
    }
  } else {
    // 如果是对象，使用 Descriptions 展示
    return (
      <Descriptions
        size="small"
        bordered
        column={depth > 0 ? 1 : undefined}
        extra={extra}
      >
        {Object.keys(data)
          .sort((a, b) => {
            const aIndex =
              keyDescriptions.find((item) => item.key === a)?.index || 0;
            const bIndex =
              keyDescriptions.find((item) => item.key === b)?.index || 0;
            return bIndex - aIndex;
          })
          .map((key) => {
            const keyDescription = keyDescriptions.find(
              (item) => item.key === key,
            );
            const description = keyDescription?.description || key;
            const value = data[key];
            return (
              <Descriptions.Item
                label={<Typography.Text strong>{description}</Typography.Text>}
                key={key}
              >
                <Item
                  keyDescription={keyDescription}
                  description={description}
                  value={value}
                  defaultActiveKey={defaultActiveKey}
                />
              </Descriptions.Item>
            );
          })}
      </Descriptions>
    );
  }
};

const DisplayJSON = ({
  data,
  keyDescriptions = [],
  defaultActiveKey = true,
  title = "JSON 预览",
  showJSON = false,
}: DisplayJSONProps & {
  showJSON;
}) => {
  const [modal, contextHolder] = Modal.useModal();

  return (
    <keyDescriptionsContext.Provider value={keyDescriptions}>
      <DisplayJSONItem
        data={data}
        isFirst={true}
        defaultActiveKey={defaultActiveKey}
        title={title}
        extra={
          showJSON && (
            <>
              {contextHolder}
              <Button
                type={"primary"}
                onClick={() => {
                  modal.info({
                    title: "原始 JSON",
                    content: (
                      <CodeMirror
                        value={JSON.stringify(data, null, 2)}
                        height={"500px"}
                        theme={quietlight}
                        lang={"json"}
                        extensions={[jsonLanguage]}
                        editable={false}
                        width={"100%"}
                      />
                    ),
                    // 点击蒙层关闭
                    maskClosable: true,
                    closable: true,
                    footer: null,
                    width: "60%",
                  });
                }}
              >
                查看原始 JSON
              </Button>
            </>
          )
        }
      />
    </keyDescriptionsContext.Provider>
  );
};

export default DisplayJSON;
