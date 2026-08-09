import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import "../css/setting.css";
import { getdelay as getDelayFromServer, setdelay as saveDelayToServer } from "../api/setting";
import { savetoken as setTokentoServer, gettoken as getTokenfromServer } from "../api/setting";

function Settings() {
    const [delay, setDelay] = useState(5);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    const [token, setToken] = useState("");
    const [savingToken, setsavingToken] = useState(false);

    useEffect(() => {
        const fetchDelay = async () => {
            try {
                const res = await getDelayFromServer();
                setDelay(res.data.delay.responseDelay);
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to Fetch the Response Delay");
            } finally {
                setLoading(false);
            }
        };
        fetchDelay();
    }, []);

    const handleSaveDelay = async () => {
        setSaving(true);
        try {
            const res = await saveDelayToServer(delay);
            toast.success(res.data.message || "Response Delay Updated Successfully!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Response Delay cannot Updated !");
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const res = await getTokenfromServer();
                setToken(res.data.token);
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to Fetch the Token");
            }
        };
        fetchToken();
    }, []);

    const handleSaveToken = async () => {
        setsavingToken(true);
        try {
            const res = await setTokentoServer(token);
            toast.success(res.data.message || "Token Saved Successfully!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Token cannot be Updated!");
        } finally {
            setsavingToken(false);
        }
    };

    return (
        <div className="settings-page">
            <div className="settings-header">
                <h2 className="settings-title">Settings</h2>
                <p className="settings-subtitle">Configure bot behaviour and WhatsApp connection</p>
            </div>

            <div className="settings-sections">
                <div className="settings-card">
                    <h3 className="settings-card-title">Reply Delay</h3>
                    <p className="settings-hint">How long the bot waits before sending a reply, in seconds.</p>

                    <div className="slider-row">
                        <input
                            type="range"
                            min="1"
                            max="300"
                            value={delay}
                            onChange={(e) => setDelay(Number(e.target.value))}
                            className="settings-slider"
                            disabled={loading}
                        />
                        <span className="slider-value">{delay}s</span>
                    </div>

                    <button className="settings-save-btn" onClick={handleSaveDelay} disabled={saving}>
                        {saving ? "Saving..." : "Save Delay"}
                    </button>
                </div>

                <div className="settings-card">
                    <h3 className="settings-card-title">WhatsApp Token</h3>
                    <p className="settings-hint">Your WhatsApp Business API access token.</p>

                    <input
                        type="password"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="EAAxxxxxxxxxxxxxxxxxxxxxxxx"
                        className="settings-input"
                    />

                    <button className="settings-save-btn" onClick={handleSaveToken} disabled={savingToken}>
                        {savingToken ? "Saving..." : "Save Token"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Settings;