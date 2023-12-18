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
} from "antd";
import CodeMirror from "@uiw/react-codemirror";
import { quietlight } from "@uiw/codemirror-theme-quietlight";
import { jsonLanguage } from "@codemirror/lang-json";

const { Panel } = Collapse;
interface DisplayJSONProps {
  // 任意类型的数据
  data: Record<string, any> | Record<string, any>[];
  // key的解释
  keyDescription?: { key: string; description: string }[];
  title?: string;
  // 默认全部展开折叠面板 list bool
  defaultActiveKey?: boolean;
}

const DisplayJSONItem = ({
  data,
  keyDescription = [],
  isFirst,
  title = "",
  defaultActiveKey = true,
}: DisplayJSONProps & {
  isFirst: boolean;
}) => {
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
                keyDescription={keyDescription}
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
      <Descriptions size="small" bordered column={depth > 0 ? 1 : undefined}>
        {Object.keys(data).map((key) => (
          <Descriptions.Item
            label={
              <Typography.Text strong>
                {keyDescription.find((item) => item.key === key)?.description ||
                  key}
              </Typography.Text>
            }
            key={key}
          >
            {/* 对象的值可能是更复杂的结构，递归处理 */}
            {typeof data[key] === "object" ? (
              Object.keys(data[key]).length > 0 ? (
                <DisplayJSONItem
                  data={data[key]}
                  keyDescription={keyDescription}
                  defaultActiveKey={defaultActiveKey}
                  title={
                    keyDescription.find((item) => item.key === key)
                      ?.description || key
                  }
                  isFirst={false}
                />
              ) : (
                <Typography.Text type="secondary">空</Typography.Text>
              ) // 是否是boolean值
            ) : typeof data[key] === "boolean" ? (
              data[key] ? (
                <Badge status="success" text="是" />
              ) : (
                <Badge status="error" text="否" />
              )
            ) : // key includes 'time' or 'date' or endsWith 'At'
            key.toLowerCase().includes("time") ||
              key.toLowerCase().includes("date") ||
              key.endsWith("At") ||
              key.endsWith("_at") ? (
              new Date(data[key]).toLocaleString()
            ) : (
              data[key].toString()
            )}
          </Descriptions.Item>
        ))}
      </Descriptions>
    );
  }
};

const DisplayJSON = ({
  data,
  keyDescription = [],
  defaultActiveKey = true,
  title = "JSON 预览",
}: DisplayJSONProps) => {
  const [modal, contextHolder] = Modal.useModal();

  return (
    <Card
      title={title}
      extra={
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
      }
    >
      <DisplayJSONItem
        data={data}
        isFirst={true}
        keyDescription={keyDescription}
        defaultActiveKey={defaultActiveKey}
        title={title}
      />
    </Card>
  );
};

export default DisplayJSON;
