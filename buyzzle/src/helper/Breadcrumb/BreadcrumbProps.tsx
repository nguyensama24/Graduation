import React from "react";
import ArrowRightBruh from "../../assets/TSX/ArrowRightBruh";

interface BreadcrumbProps {
  items: { text: string; link?: string }[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex mt-5" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-4">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <ArrowRightBruh />}
            {item.link ? (
              <a href={item.link} className="text-blue-500 text-sm">
                {item.text}
              </a>
            ) : (
              <span className="text-gray-500 text-sm ">{item.text}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
