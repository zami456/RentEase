import React from "react";

const SearchBar = ({
  searchTerm,
  setSearchTerm,
  roomFilter,
  setRoomFilter,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-3 md:gap-6 p-6 justify-center items-center bg-blue-50 rounded-xl shadow-sm">
      <input
        type="text"
        placeholder="Search by address..."
        className="p-3 rounded-lg w-72 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-100 text-blue-900 placeholder-blue-400 transition"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select
        className="p-3 rounded-lg border border-blue-200 bg-blue-100 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        value={roomFilter}
        onChange={(e) => setRoomFilter(e.target.value)}
      >
        <option value="" className="text-blue-500">
          All Rooms
        </option>
        <option value="1" className="text-blue-500">
          1 Room
        </option>
        <option value="2" className="text-blue-500">
          2 Rooms
        </option>
        <option value="3" className="text-blue-500">
          3 Rooms
        </option>
        <option value="4" className="text-blue-500">
          4 Rooms
        </option>
        <option value="5" className="text-blue-500">
          5 Rooms
        </option>
        <option value="6" className="text-blue-500">
          6 Rooms
        </option>
      </select>
    </div>
  );
};

export default SearchBar;