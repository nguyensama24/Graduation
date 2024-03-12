import { ReactNode } from "react";

export default function Container({ children }: { children: ReactNode }) {
  return <div className="max-w-[1440px] px-[60px] mx-auto">{children}</div>;
}
