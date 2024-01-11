import React from "react";
import { KeyDescription } from "./interface";

export const KeyDescriptionsContext = React.createContext<KeyDescription[]>([]);
// 编辑模式开关 context
export const EditDataContext = React.createContext<boolean>(false);
export const DescriptionsContext = React.createContext<{
  column?: number;
  layout?: "horizontal" | "vertical";
}>({});

// log switch context
export const LogSwitchContext = React.createContext<boolean>(false);
