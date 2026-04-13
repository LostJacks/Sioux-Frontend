import SearchBar from "./SearchBar";
import ScanEmployeeQrButton from "./ScanEmployeeQrButton";

const ReceptionistTopBar = ({
    searchTerm,
    setSearchTerm,
    onScanEmployee,
    onScanPackage
}) => {
    return (
        <div className="top-bar">
            <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <div className="top-bar-right">
                <button className="scan-button" onClick={onScanPackage}>
                    Scan Package
                </button>
                <ScanEmployeeQrButton onClick={onScanEmployee} />
            </div>
        </div>
    );
};

export default ReceptionistTopBar;