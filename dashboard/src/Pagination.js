export default function Pagination({ onPageClick, onKeyDown, pageIndex, isLoading }) {
  return (
    <>
      <div className="flex-col space-y-2 my-5" style={isLoading ? { pointerEvents: "none" } : {}}>
        <div className="flex justify-center">
          <label>
            Sayfa numarası girin:
          </label>
          <input
            className="mx-2 w-[30px] border-[1px] border-yellow-400"
            type="number"
            onKeyDown={onKeyDown}
          />
        </div>
        <div className="flex justify-center space-x-2">
          <button
            className="border-2 border-yellow-400 bg-white rounded-md p-1"
            onClick={() => onPageClick(pageIndex - 1)}
          >
            Önceki Sayfa
          </button>
          <button
            className="border-2 border-yellow-400 bg-white rounded-md p-1"
            onClick={() => onPageClick(pageIndex + 1)}
          >
            Sonraki Sayfa
          </button>
        </div>
      </div>
    </>
  );
}