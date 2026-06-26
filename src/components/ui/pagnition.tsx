'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-2 mt-8 py-4">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-4 py-2 bg-white border border-orange-400 text-gray-800 rounded-lg text-sm font-semibold disabled:opacity-50"
      >
        Previous
      </button>
      
      <span className="text-sm text-slate-600">
        Page {currentPage} of {totalPages}
      </span>

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-4 py-2 bg-white border border-orange-400 rounded-lg text-sm text-gray-800 font-semibold disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}