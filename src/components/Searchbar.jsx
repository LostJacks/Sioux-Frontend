const SearchBar = ({ searchTerm, setSearchTerm }) => {
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            console.log("Searching for:", searchTerm);
            // later you can trigger API here if needed
        }
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Order number"
                className="search-input"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                onKeyDown={handleKeyDown}
            />

            {/* CLEAR BUTTON */}
            {searchTerm && (
                <button
                    className="clear-button"
                    onClick={() => setSearchTerm("")}
                >
                    ✕
                </button>
            )}

            {/* SEARCH BUTTON */}
            <button className="search-button" type="button">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
            </button>
        </div>
    );
};

export default SearchBar;