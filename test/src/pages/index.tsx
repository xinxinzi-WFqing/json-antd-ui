import { Flex } from "antd";
import { DisplayJSON } from "../../../dist";

export default function HomePage() {
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
        card
        showJSON
        onChange={(data) => {
          console.log(data);
        }}
        data={{
          name: "张三",
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
        }}
      />
    </Flex>
  );
}
