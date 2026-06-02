import { useMemo } from "react";
import { X } from "lucide-react";
import {
    MAIN_STATUS_FILTERS,
} from "../utils/packageFilterUtils";

const PackageFilters = ({
    statusFilters,
    setStatusFilters,
    resultCount,
}) => {
    const toggleStatus = (id) => {
        if (id === "all") {
            setStatusFilters([]);
            return;
        }
        setStatusFilters((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
    };

    const clearAll = () => setStatusFilters([]);

    const activePills = useMemo(() => {
        return statusFilters
            .map((id) => MAIN_STATUS_FILTERS.find((f) => f.id === id))
            .filter(Boolean)
            .map((chip) => ({ key: chip.id, label: chip.label }));
    }, [statusFilters]);

    const allStatusesActive = statusFilters.length === 0;

    return (
        <div className="filter-toolbar-wrapper">
            <div className="filter-toolbar">
                <div className="filter-toolbar-main">
                    <div className="filter-toolbar-left">
                        {MAIN_STATUS_FILTERS.map(({ id, label }) => (
                            <button
                                key={id}
                                type="button"
                                className={`filter-chip ${
                                    id === "all"
                                        ? allStatusesActive
                                            ? "active"
                                            : ""
                                        : statusFilters.includes(id)
                                          ? "active"
                                          : ""
                                }`}
                                onClick={() => toggleStatus(id)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                </div>

                {(activePills.length > 0 || resultCount != null) && (
                    <div className="filter-toolbar-meta">
                        {resultCount != null && (
                            <span className="filter-result-count">
                                {resultCount} package{resultCount === 1 ? "" : "s"}
                            </span>
                        )}
                        {activePills.length > 0 && (
                            <div className="filter-active-pills">
                                {activePills.map((pill) => (
                                    <button
                                        key={pill.key}
                                        type="button"
                                        className="filter-active-pill"
                                        onClick={() =>
                                            setStatusFilters((prev) => prev.filter((s) => s !== pill.key))
                                        }
                                        title="Remove filter"
                                    >
                                        {pill.label}
                                        <X size={12} />
                                    </button>
                                ))}
                                <button type="button" className="filter-clear-all" onClick={clearAll}>
                                    Clear all
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PackageFilters;
