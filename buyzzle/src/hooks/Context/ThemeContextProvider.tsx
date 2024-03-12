import { ChangeEvent, ReactNode, createContext, useState } from "react";
type ThemeContextType = {
  data: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void; // Cập nhật thông tin dữ liệu khác
};
type ThemeContextProviderProps = {
  children: ReactNode;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);
export default function ThemeContextProvider({
  children,
}: ThemeContextProviderProps) {
  const [data, setData] = useState("");

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setData(e.target.value);
  };

  const key: ThemeContextType = {
    data,
    onChange,
  };
  return (
    <>
      <ThemeContext.Provider value={key}>{children}</ThemeContext.Provider>
    </>
  );
}
