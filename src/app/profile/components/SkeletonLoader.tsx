const SkeletonLoader = () => (
    <div className="w-full flex justify-center items-center h-screen">
      <div className="w-full max-w-2xl p-8 bg-white dark:bg-gray-800 shadow-md rounded-lg animate-pulse">
        <div className="h-8 bg-gray-300 dark:bg-gray-600 w-1/2 rounded-md mb-4"></div>
        <div className="h-5 bg-gray-300 dark:bg-gray-600 w-1/3 rounded-md mb-6"></div>
  
        <div className="space-y-4">
          <div className="h-10 bg-gray-300 dark:bg-gray-600 w-full rounded-md"></div>
          <div className="h-20 bg-gray-300 dark:bg-gray-600 w-full rounded-md"></div>
          <div className="h-10 bg-gray-300 dark:bg-gray-600 w-full rounded-md"></div>
          <div className="h-10 bg-gray-300 dark:bg-gray-600 w-full rounded-md"></div>
        </div>
  
        <div className="flex justify-between mt-6">
          <div className="h-10 bg-gray-300 dark:bg-gray-600 w-1/3 rounded-md"></div>
          <div className="h-10 bg-gray-300 dark:bg-gray-600 w-1/3 rounded-md"></div>
        </div>
      </div>
    </div>
  );
  
  export default SkeletonLoader;
  