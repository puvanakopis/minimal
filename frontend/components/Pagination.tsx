'use client';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const previousPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="mt-20 flex flex-col items-center gap-8">
      <div className="flex items-center gap-3">
        {/* Previous Button */}
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`px-4 py-2 text-sm font-medium transition-all flex items-center gap-1 ${currentPage === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-[#4e8b97] hover:text-brand-teal hover:bg-[#e7f1f3]'
            }`}
        >
          <span className="material-symbols-outlined text-base">
            chevron_left
          </span>
          Previous
        </button>

        {/* Previous / Current / Next numbers*/}
        <div className="flex items-center gap-2">
          <span className="w-10 h-10 flex items-center justify-center text-sm font-medium text-gray-400 border border-transparent">
            {previousPage ?? '-'}
          </span>
          <span className="w-10 h-10 flex items-center justify-center text-sm font-medium bg-brand-teal text-white">
            {currentPage}
          </span>
          <span className="w-10 h-10 flex items-center justify-center text-sm font-medium text-gray-400 border border-transparent">
            {nextPage ?? '-'}
          </span>
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 text-sm font-medium transition-all flex items-center gap-1 ${currentPage === totalPages
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-[#4e8b97] hover:text-brand-teal hover:bg-[#e7f1f3]'
            }`}
        >
          Next
          <span className="material-symbols-outlined text-base">
            chevron_right
          </span>
        </button>
      </div>

      {/* Optional: Current page indicator */}
      <div className="text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}