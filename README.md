# json-antd-ui

![GitHub package.json version](https://img.shields.io/github/package-json/v/geyang-git/json-antd-ui)
![License](https://img.shields.io/badge/license-MIT-green)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)

`json-antd-ui` 是一个基于 React 和 Ant Design 的组件库，旨在提供灵活、易用的 JSON 数据展示和编辑界面。它适用于需要动态显示和编辑 JSON 数据的应用场景。

## 安装

使用 npm 安装 `json-antd-ui`:

```bash
npm install json-antd-ui
```

或者使用 yarn:

```bash
yarn add json-antd-ui
```

## 使用示例

下面是一个简单的使用示例，展示了如何在项目中引入并使用 `DisplayJSON` 组件：

```javascript
import React from 'react';
import { DisplayJSON } from 'json-antd-ui';

const App = () => {
  const data = {
    name: "John Doe",
    age: 30
  };

  return <DisplayJSON data={data} />;
};

export default App;
```

## API 文档

## `DisplayJSON` 组件

`DisplayJSON` 组件用于展示和编辑 JSON 数据。

### Props

| 名称            | 类型                 | 默认值     | 必需  | 描述                                                    |
|-----------------|----------------------|------------|------|---------------------------------------------------------|
| `data`          | `object \| array`    | 无         | 是   | 要展示或编辑的 JSON 数据。                               |
| `keyDescriptions`| `KeyDescription[]`  | `[]`       | 否   | 定义 JSON 数据中各个字段的描述和显示属性。              |
| `title`         | `string`             | 无         | 否   | 组件的标题。                                            |
| `defaultActiveKey`| `boolean`          | `true`     | 否   | 控制是否默认展开所有折叠面板。                           |
| `onChange`      | `function`           | 无         | 否   | 数据变更时的回调函数。                                  |
| `showJSON`      | `boolean`            | `false`    | 否   | 是否显示原始 JSON 数据的按钮。                          |
| `editKeyDescriptions` | `boolean`      | `false`    | 否   | 是否允许编辑键名描述。                                  |
| `card`          | `object`             | 无         | 否   | 可选，用于自定义外层 Card 组件的属性。                  |
| `extra`         | `ReactNode`          | 无         | 否   | 可选，用于在组件标题栏添加额外内容。                    |
| `defaultEdit`   | `boolean`            | `false`    | 否   | 控制组件加载时是否处于编辑模式。                        |
| `column`        | `number`             | 无         | 否   | `Descriptions` 组件的列数。                             |
| `layout`        | `horizontal \| vertical` | `horizontal` | 否 | 设置 `Descriptions` 组件的布局方式。                    |

### `KeyDescription` 对象

`KeyDescription` 对象在 `DisplayJSON` 组件中用于定义 JSON 数据中各个字段的描述和显示属性。它允许您指定如何展示和处理数据中的每个字段。

#### 结构

`KeyDescription` 是一个对象，包含以下属性：

| 属性           | 类型                    | 必需 | 描述                                                         |
|----------------|-------------------------|------|--------------------------------------------------------------|
| `key`          | `string`                | 是   | JSON 数据中的字段名。                                         |
| `description`  | `string`                | 是   | 字段的人类可读描述。                                         |
| `index`        | `number`                | 否   | 字段在展示时的顺序，数值越大越靠前，可为负数。                |
| `hidden`       | `boolean`               | 否   | 控制该字段是否显示，默认为 `false`。                         |
| `type`         | `KeyDescType \| PrimitiveType` | 否   | 字段的类型，如时间、日期、链接等。                          |
| `props`        | `object`                | 否   | 根据字段类型，提供额外的属性来控制展示方式。                 |

#### `KeyDescType` 和 `PrimitiveType`

`KeyDescription` 中的 `type` 属性可以是以下几种类型：

- `KeyDescType` 枚举，包括：
    - `Time`: 时间类型。
    - `Date`: 日期类型。
    - `Link`: 链接类型。
    - `Image`: 图片类型。
    - `PDF`: PDF 文件类型。
- `PrimitiveType` 枚举，包括基本数据类型如：
    - `String`: 字符串。
    - `Number`: 数字。
    - `Boolean`: 布尔值。
    - `Object`: 对象。
    - `Array`: 数组。

#### `props` 属性

`props` 属性是一个对象，根据字段的 `type` 不同，其包含的属性也会有所不同。例如：

- 对于 `KeyDescType.Link` 类型，`props` 可以包含 `copyable` 属性来控制链接是否可复制。
- 对于 `KeyDescType.Image` 类型，`props` 可以包含 `width` 和 `height` 属性来控制图片的尺寸。

通过 `KeyDescription` 对象，您可以精确控制 `DisplayJSON` 组件中每个字段的展示方式和行为，从而提供更加丰富和定制化的用户界面。

## 贡献

欢迎为 `json-antd-ui` 贡献代码。请先阅读贡献指南，了解如何提交 pull requests。

## 许可证

`json-antd-ui` 根据 MIT 许可证发布。

## 联系方式

如有任何问题或建议，请通过 [GitHub Issues](https://github.com/your-username/json-antd-ui/issues) 联系我们。
