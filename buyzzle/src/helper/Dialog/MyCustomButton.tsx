
import React, { MouseEventHandler } from 'react';

interface MyCustomButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}
const MyCustomButton : React.FC<MyCustomButtonProps> = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="flex flex-wrap mb-1.5 justify-center w-full border border-gray-300 hover:border-gray-500 px-2 py-1.5 rounded-md"
  >
    {children}
  </button>
);

export default MyCustomButton;