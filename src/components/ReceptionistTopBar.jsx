import SearchBar from "./SearchBar";

const ReceptionistTopBar = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="top-bar">
            <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <div className="top-bar-right">
                <button className="scan-button">Scan Package</button>
                <button className="scan-button">Scan Employee QR</button>
            </div>
        </div>
    );
};

export default ReceptionistTopBar;