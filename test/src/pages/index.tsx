import { Flex } from "antd";
import { DisplayJSON, KeyDescType, PrimitiveType } from "../../../dist";
import { useState } from "react";

export default function HomePage() {
  const [data, setData] = useState({
    name: "张三",
    select: "张三",
    age: 18,
    position: "前端",
    skills: [
      "React",
      "Vue",
      "Angular",
      "Vue",
      "Angular",
      "Vue",
      "Angular",
      "Vue",
      "Angular",
    ],
    publiclyTraded: true,
    lastUpdated: new Date().getTime(),
    createdAt: new Date().getTime(),
    image:
      "https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg",
    pdf: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    a: {
      b: {
        c: [
          { d: 1, e: { f: 2 } },
          { d: 3, e: { f: 4 } },
        ],
      },
    },
  });
  return (
    <Flex
      vertical
      align={"center"}
      style={{
        marginTop: "100px",
        marginLeft: "25%",
        marginRight: "25%",
      }}
      gap={"large"}
    >
      <DisplayJSON
        title={"keyDescriptions 注入 onChange 测试"}
        card
        showJSON
        onChange={(data) => {
          setData(data);
        }}
        defaultEdit
        keyDescriptions={[
          {
            key: "age",
            type: PrimitiveType.String,
            description: "年龄",
            onChange: (value, path) => {
              console.log(value, path);
            },
          },
          {
            key: "skills",
            description: "技能",
            onChange: (value, path) => {
              console.log(value, path);
            },
          },
          {
            key: "select",
            type: KeyDescType.Select,
            description: "选择",
            props: {
              options: [
                {
                  label: "张三",
                  value: "张三",
                },
                {
                  label: "李四",
                  value: "李四",
                },
              ],
            },
            onChange: (value, path) => {
              console.log(value, path);
            },
          },
          // publiclyTraded
          {
            key: "publiclyTraded",
            type: PrimitiveType.Boolean,
            description: "是否上市",
            onChange: (value, path) => {
              console.log(value, path);
            },
            props: {
              checkedChildren: "Yes",
              unCheckedChildren: "No",
            },
          },
          {
            key: "f",
            onChange: (value, path) => {
              console.log(value, path);
            },
          },
        ]}
        data={data}
      />
      <DisplayJSON
        title={"受控组件"}
        card
        showJSON
        onChange={(data) => {
          setData(data);
        }}
        keyDescriptions={[
          {
            key: "select",
            type: KeyDescType.Select,
            description: "选择",
            props: {
              options: [
                {
                  label: "张三",
                  value: "张三",
                },
                {
                  label: "李四",
                  value: "李四",
                },
              ],
            },
          },
        ]}
        data={data}
      />
      <DisplayJSON
        title={"非受控组件"}
        card
        showJSON
        keyDescriptions={[
          {
            key: "select",
            type: KeyDescType.Select,
            description: "选择",
            props: {
              options: [
                {
                  label: "张三",
                  value: "张三",
                },
                {
                  label: "李四",
                  value: "李四",
                },
              ],
            },
          },
        ]}
        data={data}
      />
    </Flex>
  );
}
