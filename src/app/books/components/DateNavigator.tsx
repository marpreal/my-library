const DateNavigator = ({
  currentMonth,
  currentYear,
  onPreviousMonth,
  onNextMonth,
  isViewingYear,
  onToggleView,
}: {
  currentMonth: number;
  currentYear: number;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  isViewingYear: boolean;
  onToggleView: () => void;
}) => {
  const formattedDate = new Intl.DateTimeFormat("default", {
    month: "long",
    year: "numeric",
  }).format(new Date(currentYear, currentMonth));

  return (
    <div className="flex flex-wrap justify-center items-center gap-4 mb-6 z-20 max-w-6xl px-6 mt-6 sm:mt-8">
      <div className="w-full flex items-center justify-center gap-4">
        {!isViewingYear && (
          <button
            onClick={onPreviousMonth}
            className="text-2xl sm:text-base p-2 sm:px-4 sm:py-2 bg-gray-200 rounded-lg shadow hover:bg-gray-300 transition"
          >
            {/* Show arrows on mobile, text on larger screens */}
            <span className="sm:hidden">←</span>
            <span className="hidden sm:inline">Previous Month</span>
          </button>
        )}

        <span className="text-lg font-bold bg-gray-100 px-4 py-2 rounded shadow text-center">
          {isViewingYear ? currentYear : formattedDate}
        </span>

        {!isViewingYear && (
          <button
            onClick={onNextMonth}
            className="text-2xl sm:text-base p-2 sm:px-4 sm:py-2 bg-gray-200 rounded-lg shadow hover:bg-gray-300 transition"
          >
            {/* Show arrows on mobile, text on larger screens */}
            <span className="sm:hidden">→</span>
            <span className="hidden sm:inline">Next Month</span>
          </button>
        )}
      </div>

      <button
        onClick={onToggleView}
        className="px-4 py-2 bg-gold text-white rounded-lg shadow-md hover:bg-highlight hover:text-golden transition"
      >
        {isViewingYear ? "Back to Current Month" : "View Year"}
      </button>
    </div>
  );
};

export default DateNavigator;
