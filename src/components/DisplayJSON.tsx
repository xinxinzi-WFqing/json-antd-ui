import React, { useEffect } from "react";
import {
  Badge,
  Button,
  Card,
  Collapse,
  DatePicker,
  Descriptions,
  Image,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Space,
  Switch,
  Typography,
} from "antd";
import CodeMirror from "@uiw/react-codemirror";
import { quietlight } from "@uiw/codemirror-theme-quietlight";
import { jsonLanguage } from "@codemirror/lang-json";
import dayjs from "dayjs";
import { detectTimeType, formatTime } from "../utils/time";
import customParseFormat from "dayjs/plugin/customParseFormat";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import EditableDraggableList from "./DraggableList";
import { fileToBase64, UploadFileItem } from "./UploadFile";
import {
  DisplayJSONProps,
  JsonObject,
  KeyDescription,
  KeyDescType,
  PrimitiveType,
} from "../interface";
import {
  DescriptionsContext,
  EditDataContext,
  KeyDescriptionsContext,
} from "../context";
import { countBranches } from "../utils";

dayjs.extend(customParseFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);

export const Item = ({
  keyDescription,
  description,
  value,
  allValue,
  defaultActiveKey,
  onChange,
}: {
  keyDescription?: KeyDescription;
  description?: string;
  value: any;
  allValue: any;
  defaultActiveKey?: boolean;
  onChange?: (value: any) => void;
}) => {
  const editData = React.useContext(EditDataContext);

  const getPrimitiveType = (data: any) => {
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
  const onItemChange = keyDescription?.onChange;
  const hidden = keyDescription?.hidden;

  if (hidden) {
    return <Typography.Text type={"secondary"}>已隐藏</Typography.Text>;
  }

  const itemMap = new Map<typeof type, React.ReactNode>([
    [
      PrimitiveType.String,
      editData ? (
        value?.length > 140 ? (
          <Input.TextArea
            value={value}
            onChange={(e) => {
              onChange?.(e.target.value);
              onItemChange?.(e.target.value, [], value);
            }}
            autoSize={{ minRows: 4 }}
          />
        ) : (
          <Input
            // ellipsis 只取前后 props.ellipsis.length 个字符
            value={
              !!props.ellipsis
                ? `${value.slice(0, props.ellipsis.length)}...${value.slice(
                    value.length - props.ellipsis.length,
                    value.length,
                  )}`
                : value
            }
            onChange={(e) => {
              onChange?.(e.target.value);
              onItemChange?.(e.target.value, [], value);
            }}
          />
        )
      ) : (
        <Typography.Text copyable={props.copyable}>
          {
            // ellipsis 只取前后 props.ellipsis.length 个字符
            !!props.ellipsis
              ? `${value.slice(0, props.ellipsis.length)}...${value.slice(
                  value.length - props.ellipsis.length,
                  value.length,
                )}`
              : value
          }
        </Typography.Text>
      ),
    ],
    [
      PrimitiveType.Number,
      editData ? (
        <InputNumber
          value={value}
          onChange={(value) => {
            onChange?.(value);
          }}
          style={{
            width: "100%",
          }}
        />
      ) : (
        <Typography.Text copyable={props.copyable}>{value}</Typography.Text>
      ),
    ],
    [
      KeyDescType.Select,
      editData ? (
        <Select
          value={value}
          onChange={(value) => {
            onChange?.(value);
          }}
          style={{
            width: "100%",
          }}
          options={props.options}
        />
      ) : (
        <Typography.Text copyable={props.copyable}>{value}</Typography.Text>
      ),
    ],
    [
      PrimitiveType.Boolean,
      editData ? (
        <Switch
          checked={value}
          onChange={(checked) => {
            onChange?.(checked);
          }}
          checkedChildren={props.checkedChildren || "是"}
          unCheckedChildren={props.unCheckedChildren || "否"}
        />
      ) : value ? (
        <Badge status="success" text={props.checkedChildren || "是"} />
      ) : (
        <Badge status="error" text={props.unCheckedChildren || "否"} />
      ),
    ],
    [
      PrimitiveType.Object,
      <DisplayJSONItem
        data={value}
        allData={allValue}
        defaultActiveKey={defaultActiveKey}
        title={description}
        onChange={onChange}
      />,
    ],
    [
      PrimitiveType.Array,
      <DisplayJSONItem
        data={value}
        allData={allValue}
        defaultActiveKey={defaultActiveKey}
        title={description}
        onChange={onChange}
      />,
    ],
    [
      KeyDescType.JSONString,
      <DisplayJSONItem
        data={(() => {
          try {
            return JSON.parse(value);
          } catch {
            return {};
          }
        })()}
        allData={allValue}
        defaultActiveKey={defaultActiveKey}
        title={description}
        onChange={(obj) => {
          onChange?.(JSON.stringify(obj));
        }}
      />,
    ],
    [
      KeyDescType.Time,
      editData ? (
        <DatePicker
          showTime
          value={dayjs(value)}
          onChange={(res) => {
            // 判断原始值 类型
            const type = detectTimeType(value);
            onChange?.(formatTime(res, type));
          }}
        />
      ) : value === null || value === undefined || value === "" ? null : (
        dayjs(value).format(props.format || "YYYY-MM-DD HH:mm:ss")
      ),
    ],
    [
      KeyDescType.Date,
      editData ? (
        <DatePicker
          showTime
          value={dayjs(value)}
          onChange={(res) => {
            // 判断原始值 类型
            const type = detectTimeType(value);
            onChange?.(res.format(type));
          }}
        />
      ) : value === null || value === undefined || value === "" ? null : (
        dayjs(value).format(props.format || "YYYY-MM-DD HH:mm:ss")
      ),
    ],
    [
      KeyDescType.Link,
      editData ? (
        <Input
          value={value}
          onChange={(e) => {
            onChange?.(e.target.value);
          }}
        />
      ) : (
        <Typography.Link copyable={props.copyable}>{value}</Typography.Link>
      ),
    ],
    [
      KeyDescType.Image,
      editData ? (
        <Input
          value={value}
          onChange={(e) => {
            onChange?.(e.target.value);
          }}
        />
      ) : (
        <Image
          src={value}
          alt={description}
          style={{
            maxWidth: "100%",
            width: props.width || "auto",
            height: props.height || "auto",
            objectFit: "cover",
          }}
        />
      ),
    ],
    [
      KeyDescType.PDF,
      editData ? (
        <UploadFileItem
          onChange={async (info) => {
            if (props.type === "base64") {
              fileToBase64(info, async function (base64String: string) {
                if (onItemChange(base64String, [], allValue, info)) {
                  onChange?.(base64String);
                }
              });
            }
          }}
        />
      ) : (
        <iframe
          style={{
            maxWidth: "100%",
            width: props.width || "auto",
            height: props.height || "auto",
            objectFit: "cover",
            border: "none",
          }}
          src={
            {
              base64: value,
              url: value,
            }[props.type || "url"] || value
          }
        />
      ),
    ],
  ]);

  return itemMap.get(type);
};

const DisplayJSONItem = ({
  data,
  allData,
  title = "",
  defaultActiveKey = true,
  extra,
  onChange,
}: DisplayJSONProps<any> & {
  extra?: React.ReactNode;
}) => {
  const keyDescriptions = React.useContext(KeyDescriptionsContext);
  const editData = React.useContext(EditDataContext);
  const { column, layout } = React.useContext(DescriptionsContext);

  const calcKeyArray = () =>
    Object.keys(data).sort((a, b) => {
      const aIndex = keyDescriptions.find((item) => item.key === a)?.index || 0;
      const bIndex = keyDescriptions.find((item) => item.key === b)?.index || 0;
      if (aIndex !== bIndex) {
        // 如果 index 不同，则优先根据 index 排序
        return bIndex - aIndex;
      } else {
        // 如果 index 相同
        const aValue = data[a];
        const bValue = data[b];
        const aValueIsNumber = typeof aValue === "number";
        const bValueIsNumber = typeof bValue === "number";
        const aValueIsString = typeof aValue === "string";
        const bValueIsString = typeof bValue === "string";

        if (aValueIsNumber && bValueIsNumber) {
          // 如果两者都是数字，则按数字大小排序
          return aValue - bValue;
        } else if (aValueIsString && bValueIsString) {
          // 如果两者都是字符串，则按字符串长度排序
          return aValue.length - bValue.length;
        } else if (aValueIsNumber) {
          // 如果 aValue 是数字而 bValue 不是，则 aValue 排在前面（或者后面，根据需求调整）
          return -1;
        } else if (bValueIsNumber) {
          // 如果 bValue 是数字而 aValue 不是，则 bValue 排在前面（或者后面，根据需求调整）
          return 1;
        } else {
          // 其他情况保持原顺序
          return 0;
        }
      }
    });

  // 记录当前顺序数组
  const [keyArray, setKeyArray] = React.useState(calcKeyArray());

  const count = countBranches(data);

  useEffect(() => {
    if (!editData) {
      setKeyArray(calcKeyArray());
    }
  }, [count, editData, keyDescriptions]);

  useEffect(() => {
    setKeyArray(calcKeyArray());
  }, [count]);

  const isArray = Array.isArray(data);
  // 获取 data 深度
  const getDepth = (data: { [x: string]: any }) => {
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
        <EditableDraggableList
          id={title}
          data={data}
          onChange={(value) => {
            onChange?.(value);
          }}
          editData={editData}
          ItemComponent={Item}
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
                allData={allData}
                defaultActiveKey={defaultActiveKey}
                onChange={(value) => {
                  const newData = [...data];
                  newData[index] = value;
                  onChange?.(newData);
                }}
              />
            ),
            extra: editData && (
              <Space>
                {/* 复制 */}
                <Button
                  size={"small"}
                  onClick={(event) => {
                    // 冒泡
                    event.stopPropagation();
                    const newData = [...data];
                    const item = newData[index];
                    newData.splice(index + 1, 0, item);
                    onChange?.(newData);
                    // 详细的复制说明
                    message
                      .success(
                        `复制成功，已将第 ${index + 1} 项复制插入到第 ${
                          index + 2
                        } 项`,
                      )
                      .then();
                  }}
                >
                  复制
                </Button>
                {/* 上移 下移 删除 */}
                <Button
                  size={"small"}
                  onClick={(event) => {
                    // 冒泡
                    event.stopPropagation();
                    const newData = [...data];
                    const item = newData[index];
                    newData.splice(index, 1);
                    newData.splice(index - 1, 0, item);
                    onChange?.(newData);
                    // 详细的说明
                    message
                      .success(
                        `上移成功，已将第 ${index + 1} 项与第 ${index} 项交换`,
                      )
                      .then();
                  }}
                  disabled={index === 0}
                >
                  上移
                </Button>
                <Button
                  size={"small"}
                  onClick={(event) => {
                    // 冒泡
                    event.stopPropagation();
                    const newData = [...data];
                    const item = newData[index];
                    newData.splice(index, 1);
                    newData.splice(index + 1, 0, item);
                    onChange?.(newData);
                    // 详细的说明
                    message
                      .success(
                        `下移成功，已将第 ${index + 1} 项与第 ${
                          index + 2
                        } 项交换`,
                      )
                      .then();
                  }}
                  disabled={index === data.length - 1}
                >
                  下移
                </Button>
                <Button
                  size={"small"}
                  danger
                  onClick={(event) => {
                    // 冒泡
                    event.stopPropagation();
                    const newData = [...data];
                    newData.splice(index, 1);
                    onChange?.(newData);
                    // 详细的说明
                    message
                      .success(`删除成功，已删除第 ${index + 1} 项`)
                      .then();
                  }}
                >
                  删除
                </Button>
              </Space>
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
        column={column ?? depth > 0 ? 1 : undefined}
        extra={extra}
        layout={layout ?? depth > 0 ? "horizontal" : "vertical"}
      >
        {keyArray
          .map((key) => {
            const keyDescription = keyDescriptions.find(
              (item) => item.key === key,
            );
            const description = keyDescription?.description || key;
            const value = data[key];
            const hidden = keyDescription?.hidden;
            if (hidden) {
              return null;
            }
            return (
              <Descriptions.Item
                label={
                  <Typography.Text
                    strong
                    style={{
                      whiteSpace: "nowrap",
                    }}
                  >
                    {description}
                  </Typography.Text>
                }
                labelStyle={{
                  whiteSpace: "pre-wrap",
                }}
                key={key}
              >
                <Item
                  keyDescription={keyDescription}
                  description={description}
                  value={value}
                  allValue={allData}
                  defaultActiveKey={defaultActiveKey}
                  onChange={(value) => {
                    const newData = { ...data };
                    newData[key] = value;
                    onChange?.(newData);
                  }}
                />
              </Descriptions.Item>
            );
          })
          .filter(Boolean)}
      </Descriptions>
    );
  }
};

const DisplayJSON = <T extends JsonObject>({
  data: defaultData,
  onChange,
  keyDescriptions: defaultKeyDescriptions = [],
  keyDescriptionsOnChange,
  defaultActiveKey = true,
  title = "JSON 预览",
  showJSON = false,
  editKeyDescriptions = false,
  card,
  extra: defaultExtra,
  defaultEdit = false,
  column,
  layout,
}: Omit<Omit<DisplayJSONProps<T>, "editData">, "allData"> & {
  keyDescriptionsOnChange?: (keyDescriptions: KeyDescription[]) => void;
  showJSON?: boolean;
  editKeyDescriptions?: boolean;
  card?: any;
  extra?: any;
  defaultEdit?: boolean;
  column?: number;
  layout?: "horizontal" | "vertical";
}) => {
  const controlled = !!onChange;
  const keyDescriptionsControlled = !!keyDescriptionsOnChange;
  const keyDescriptionsState = React.useState<KeyDescription[]>(
    defaultKeyDescriptions,
  );
  const dataState = React.useState<Record<string, any> | Record<string, any>[]>(
    defaultData,
  );
  const [editData, setEditData] = React.useState<boolean>(defaultEdit);

  const data = controlled ? defaultData : dataState[0];
  const setData = controlled ? onChange : dataState[1];

  const keyDescriptions = keyDescriptionsControlled
    ? defaultKeyDescriptions
    : keyDescriptionsState[0];
  const setKeyDescriptions = keyDescriptionsControlled
    ? keyDescriptionsOnChange
    : keyDescriptionsState[1];

  const [modal, contextHolder] = Modal.useModal();

  const extra = showJSON && (
    <>
      {contextHolder}
      <Space>
        {defaultExtra}
        {/*编辑模式开关*/}
        {onChange && (
          <Switch
            checked={editData}
            onChange={(checked) => {
              setEditData(checked);
            }}
            checkedChildren={"编辑"}
            unCheckedChildren={"预览"}
          />
        )}
        {editKeyDescriptions && (
          <Button
            type={"primary"}
            onClick={() => {
              modal.info({
                title: "编辑键名描述",
                content: (
                  <CodeMirror
                    value={JSON.stringify(keyDescriptions, null, 2)}
                    height={"500px"}
                    theme={quietlight}
                    lang={"json"}
                    extensions={[jsonLanguage]}
                    width={"100%"}
                    onChange={(value) => {
                      try {
                        const keyDescriptions = JSON.parse(value);
                        setKeyDescriptions(keyDescriptions);
                      } catch (error) {
                        console.error(error);
                      }
                    }}
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
            编辑键名描述
          </Button>
        )}
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
                  editable={!!onChange}
                  width={"100%"}
                  onChange={(value) => {
                    try {
                      const data = JSON.parse(value);
                      setData(data);
                      onChange?.(data);
                    } catch (error) {
                      console.error(error);
                    }
                  }}
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
          {onChange?.toString() ? "编辑" : "查看"}原始 JSON
        </Button>
      </Space>
    </>
  );

  return (
    <DescriptionsContext.Provider
      value={{
        column,
        layout,
      }}
    >
      <EditDataContext.Provider value={editData}>
        <KeyDescriptionsContext.Provider value={keyDescriptions}>
          {card ? (
            <Card {...card} title={title} extra={extra}>
              <DisplayJSONItem
                data={data}
                allData={data}
                onChange={(value) => {
                  try {
                    setData(value);
                    onChange?.(value);
                  } catch (error) {
                    console.error(error);
                  }
                }}
                defaultActiveKey={defaultActiveKey}
              />
            </Card>
          ) : (
            <DisplayJSONItem
              data={data}
              allData={data}
              onChange={(value) => {
                try {
                  setData(value);
                  onChange?.(value);
                } catch (error) {
                  console.error(error);
                }
              }}
              defaultActiveKey={defaultActiveKey}
              title={title}
              extra={extra}
            />
          )}
        </KeyDescriptionsContext.Provider>
      </EditDataContext.Provider>
    </DescriptionsContext.Provider>
  );
};

export default DisplayJSON;
