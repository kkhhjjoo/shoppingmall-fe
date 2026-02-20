import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "react-router-dom";

const SearchBox = ({ searchQuery, setSearchQuery, placeholder, field }) => {
  const [query] = useSearchParams();
  const urlKeyword = query.get(field) || "";
  const [keyword, setKeyword] = useState(urlKeyword);

  // URL이 바뀌면 검색어 입력값 동기화 (뒤로가기 등)
  useEffect(() => {
    setKeyword(urlKeyword);
  }, [urlKeyword]);

  const onCheckEnter = (event) => {
    if (event.key === "Enter") {
      const value = (event.target.value || "").trim();
      setSearchQuery({ ...searchQuery, page: 1, [field]: value });
    }
  };
  return (
    <div className="search-box">
      <FontAwesomeIcon icon={faSearch} />
      <input
        type="text"
        placeholder={placeholder}
        onKeyPress={onCheckEnter}
        onChange={(event) => setKeyword(event.target.value)}
        value={keyword}
      />
    </div>
  );
};

export default SearchBox;
