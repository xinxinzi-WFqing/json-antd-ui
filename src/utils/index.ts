export function countBranches(obj: any): number {
  if (Array.isArray(obj)) {
    // 数组: 计数本身加上数组内部的分支数
    return obj.reduce((sum, item) => sum + countBranches(item), 1);
  } else if (typeof obj === "object" && obj !== null) {
    // 对象: 计数每个属性的分支数
    return Object.values(obj).reduce<number>(
      (sum, value) => sum + countBranches(value),
      1,
    );
  } else if (typeof obj === "string") {
    // 尝试解析字符串为JSON
    try {
      const parsed = JSON.parse(obj);
      return countBranches(parsed);
    } catch (e) {
      // 如果不是JSON字符串，计数为1
      return 1;
    }
  } else {
    // 基本类型或null，计数为1
    return 1;
  }
}
