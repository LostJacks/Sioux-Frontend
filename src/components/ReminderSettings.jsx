import { useState, useEffect } from "react";
import { getReminderSettings, updateReminderSettings } from "../services/ReminderSettingsApi";

/**
 * ReminderSettings
 *
 * Allows a receptionist (or manager) to configure automated pickup-reminder
 * notifications:
 *  - Enable / disable the scheduler
 *  - Initial delay (hours after arrival for first reminder)
 *  - Repeat interval (hours between subsequent reminders; 0 = no repeat)
 *  - Max reminders per package (0 = unlimited)
 */
const ReminderSettings = () => {
    const [settings, setSettings] = useState({
        enabled: true,
        initialDelayHours: 24,
        repeatIntervalHours: 24,
        maxReminders: 3,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState(null); // { type: "success"|"error", message }

    useEffect(() => {
        getReminderSettings()
            .then((data) => {
                setSettings({
                    enabled: data.enabled ?? true,
                    initialDelayHours: data.initialDelayHours ?? 24,
                    repeatIntervalHours: data.repeatIntervalHours ?? 24,
                    maxReminders: data.maxReminders ?? 3,
                });
            })
            .catch(() =>
                setStatus({ type: "error", message: "Could not load settings." })
            )
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (field, value) => {
        setSettings((prev) => ({ ...prev, [field]: value }));
        setStatus(null);
    };

    const handleSave = async () => {
        setSaving(true);
        setStatus(null);
        try {
            const saved = await updateReminderSettings(settings);
            setSettings({
                enabled: saved.enabled,
                initialDelayHours: saved.initialDelayHours,
                repeatIntervalHours: saved.repeatIntervalHours,
                maxReminders: saved.maxReminders,
            });
            setStatus({ type: "success", message: "Settings saved successfully." });
        } catch {
            setStatus({ type: "error", message: "Failed to save settings." });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="reminder-settings-card">
            <div className="reminder-settings-header">
                <h3 className="reminder-settings-title">Automatic Reminder Settings</h3>
                <label className="toggle-label">
                    <input
                        type="checkbox"
                        checked={settings.enabled}
                        onChange={(e) => handleChange("enabled", e.target.checked)}
                        className="toggle-input"
                    />
                    <span className={`toggle-pill ${settings.enabled ? "toggle-pill--on" : ""}`}>
                        {settings.enabled ? "Enabled" : "Disabled"}
                    </span>
                </label>
            </div>

            {loading ? (
                <p className="reminder-settings-loading">Loading…</p>
            ) : (
                <div className={`reminder-settings-body ${!settings.enabled ? "reminder-settings-body--disabled" : ""}`}>
                    <div className="reminder-field-row">
                        <div className="reminder-field">
                            <label className="reminder-field-label">
                                First reminder after
                            </label>
                            <div className="reminder-input-unit">
                                <input
                                    type="number"
                                    min="0"
                                    max="720"
                                    value={settings.initialDelayHours}
                                    disabled={!settings.enabled}
                                    onChange={(e) =>
                                        handleChange("initialDelayHours", Number(e.target.value))
                                    }
                                    className="reminder-number-input"
                                />
                                <span className="reminder-unit">hours</span>
                            </div>
                        </div>

                        <div className="reminder-field">
                            <label className="reminder-field-label">
                                Repeat every
                            </label>
                            <div className="reminder-input-unit">
                                <input
                                    type="number"
                                    min="0"
                                    max="720"
                                    value={settings.repeatIntervalHours}
                                    disabled={!settings.enabled}
                                    onChange={(e) =>
                                        handleChange("repeatIntervalHours", Number(e.target.value))
                                    }
                                    className="reminder-number-input"
                                />
                                <span className="reminder-unit">hours</span>
                            </div>
                        </div>

                        <div className="reminder-field">
                            <label className="reminder-field-label">
                                Max reminders
                            </label>
                            <div className="reminder-input-unit">
                                <input
                                    type="number"
                                    min="0"
                                    max="50"
                                    value={settings.maxReminders}
                                    disabled={!settings.enabled}
                                    onChange={(e) =>
                                        handleChange("maxReminders", Number(e.target.value))
                                    }
                                    className="reminder-number-input"
                                />
                                <span className="reminder-unit">total</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="reminder-settings-footer">
                {status && (
                    <span
                        className={`reminder-status-msg reminder-status-msg--${status.type}`}
                    >
                        {status.message}
                    </span>
                )}
                <button
                    className="reminder-save-button"
                    onClick={handleSave}
                    disabled={saving || loading}
                >
                    {saving ? "Saving…" : "Save"}
                </button>
            </div>
        </div>
    );
};

export default ReminderSettings;
