import dayjs from "dayjs";
import isLeapYear from "dayjs/plugin/isLeapYear";
import Image from "next/image";
import { useMemo } from "react";

dayjs.extend(isLeapYear);
export default function Home() {
  // 获取当前年份
  const currentYear = dayjs().year();

  // 判断是否为闰年
  const isLeapYear = dayjs(`${currentYear}`).isLeapYear();

  // 根据是否为闰年确定天数
  const daysInYear = isLeapYear ? 366 : 365;

  const days = useMemo(() => {
    return Array.from({ length: daysInYear }, (_, index) => index + 1);
  }, [daysInYear]);

  const now = new Date();
  const year = now.getFullYear();
  const start = new Date(year, 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay) + 1; // 今天是一天当中的第几天

  return (
    <div className="h-[100vh] w-[100vw] flex">
      <div className="wrapper m-auto">
        <p>
          离 {currentYear} 年结束还有 <b>{daysInYear - day}</b> 天
        </p>

        <ul className="flex flex-wrap gap-[12px] max-w-[800px]">
          {days.map((d) => {
            return (
              <li
                key={d}
                className="w-[10px] h-[10px] rounded-[2px] select-none">
                {d < day && "🟩"}
                {d === day && "🌞"}
                {d > day && "⬜️"}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
