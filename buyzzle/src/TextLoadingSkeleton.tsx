
export default function TextLoadingSkeleton() {
  return (
    <div className="flex animate-pulse">
      <div className="flex-shrink-0">
        <span className="w-12 h-12 block bg-gray-200 rounded-full"></span>
      </div>

      <div className="ml-4 mt-2 w-full">
        <h3
          className="h-4 bg-gray-200 rounded-md"
          style={{ width: "40%" }}
        ></h3>

        <ul className="mt-5 space-y-3">
          <li className="w-full h-4 bg-gray-200 rounded-md dark-bg-gray-700"></li>
          <li className="w-full h-4 bg-gray-200 rounded-md dark-bg-gray-700"></li>
          <li className="w-full h-4 bg-gray-200 rounded-md dark-bg-gray-700"></li>
          <li className="w-full h-4 bg-gray-200 rounded-md dark-bg-gray-700"></li>
        </ul>
      </div>
    </div>
  );
}
