import dayjs, { Dayjs } from "dayjs";

enum TimeType {
  TimestampSeconds = "Timestamp (seconds)",
  TimestampMilliseconds = "Timestamp (milliseconds)",
  ISO8601 = "ISO 8601",
  RFC2822 = "RFC 2822",
  UTC = "UTC",
  Unknown = "Unknown Format",
}

const formatTemplates = {
  [TimeType.ISO8601]: "YYYY-MM-DDTHH:mm:ssZ", // ISO 8601 格式
  [TimeType.RFC2822]: "ddd, DD MMM YYYY HH:mm:ss ZZ", // RFC 2822 格式
  [TimeType.UTC]: "YYYY-MM-DD HH:mm:ss UTC", // UTC 格式
  [TimeType.Unknown]: "", // 未知格式不提供模板
};

function detectTimeType(timeString: string): TimeType {
  // 检查是否为毫秒时间戳（13位数字）
  if (/^\d{13}$/.test(timeString)) {
    return TimeType.TimestampMilliseconds;
  }
  // 检查是否为秒时间戳（最多10位数字）
  else if (/^\d{1,10}$/.test(timeString)) {
    return TimeType.TimestampSeconds;
  }
  // 检查是否符合ISO 8601格式
  else if (
    /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z|(\+|-)\d{2}:\d{2})/.test(timeString)
  ) {
    return TimeType.ISO8601;
  }
  // 检查是否符合RFC 2822格式
  else if (
    /\w{3}, \d{1,2} \w{3} \d{4} \d{2}:\d{2}:\d{2} GMT/.test(timeString)
  ) {
    return TimeType.RFC2822;
  }
  // 检查是否符合UTC格式
  else if (/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} UTC/.test(timeString)) {
    return TimeType.UTC;
  } else {
    return TimeType.Unknown;
  }
}

const formatTime = (dayjs: Dayjs, format: TimeType): string | number => {
  switch (format) {
    case TimeType.TimestampSeconds:
      return dayjs?.unix() || 0;
    case TimeType.TimestampMilliseconds:
      return dayjs?.valueOf() || 0;
    default:
      return dayjs?.format(formatTemplates[format]);
  }
};

// 示例
// console.log(detectTimeType("2023-12-15T12:00:00Z")); // TimeType.ISO8601
// console.log(detectTimeType("1641016800")); // TimeType.TimestampSeconds
// console.log(detectTimeType("1641016800123")); // TimeType.TimestampMilliseconds
// console.log(detectTimeType("Fri, 31 Dec 2021 23:59:59 GMT")); // TimeType.RFC2822
// console.log(detectTimeType("2023-12-15 12:00:00 UTC")); // TimeType.UTC

export { detectTimeType, TimeType, formatTemplates, formatTime };
