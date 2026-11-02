import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "衣装灵感库 | AI 服装参考图库",
  description:
    "探索 1,407 套 AI 生成的服装参考，涵盖春夏秋冬、内衣、派对、泳装与性感八大分类。支持按颜色、服饰、季节或编号搜索，查看高清预览与原始 PNG 图片。",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
