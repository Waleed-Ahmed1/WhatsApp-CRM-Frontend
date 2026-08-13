import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import "../css/setting.css";
import { getdelay as getDelayFromServer, setdelay as saveDelayToServer } from "../api/setting";
import { savetoken as setTokentoServer, gettoken as getTokenfromServer } from "../api/setting";
import { setsystemprompt, getsystemprompt,getaimode,setaimode } from "../api/setting";

function Settings() {
    const [delay, setDelay] = useState(5);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    const [token, setToken] = useState("");
    const [savingToken, setsavingToken] = useState(false);

    const [systemprompt, setSystemprompt] = useState("");
    const [savingPrompt, setSavingPrompt] = useState(false);

    useEffect(() => {
        const fetchDelay = async () => {
            try {
                const res = await getDelayFromServer();
                setDelay(res.data.delay);
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
                setToken(res.data.whatsAppAccessToken);
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

    useEffect(() => {
        const getSystemPrompt = async () => {
            try {
                const res = await getsystemprompt();
                setSystemprompt(res.data.systemPrompt);
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to Fetch the System Prompt");
            }
        };
        getSystemPrompt();
    }, []);

    const setSystemPrompt = async () => {
        setSavingPrompt(true);
        try {
            const res = await setsystemprompt(systemprompt);
            toast.success(res.data.message || "System Prompt Saved Successfully!");
        } catch (err) {
            toast.error(err.response?.data?.message || "System Prompt cannot be Updated!");
        } finally {
            setSavingPrompt(false);
        }
    };


    const [aiEnabled, setAiEnabled] = useState(true);
    const [loadingAiMode, setLoadingAiMode] = useState(true);
    const [togglingAiMode, setTogglingAiMode] = useState(false);
    useEffect(() => {
        const fetchAiMode = async () => {
            try {
                const res = await getaimode();
                setAiEnabled(res.data.globalAiMode);
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to fetch AI mode");
            } finally {
                setLoadingAiMode(false);
            }
        };
        fetchAiMode();
    }, []);

    const handleToggleAiMode = async () => {
        const newValue = !aiEnabled;
        setTogglingAiMode(true);
        try {
            const res = await setaimode(newValue);
            setAiEnabled(newValue);
            toast.success(res.data.message || `AI ${newValue ? "enabled" : "disabled"} globally`);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update AI mode");
        } finally {
            setTogglingAiMode(false);
        }
    };

    return (
        <div className="settings-page">
            <div className="settings-header">
                <div>
                    <h2 className="settings-title">Settings</h2>
                    <p className="settings-subtitle">Configure bot behaviour and WhatsApp connection</p>
                </div>

                <button
                    className={`ai-toggle-btn ${aiEnabled ? "on" : "off"}`}
                    onClick={handleToggleAiMode}
                    disabled={loadingAiMode || togglingAiMode}
                >
                    <span className="ai-toggle-track">
                        <span className="ai-toggle-thumb" />
                    </span>
                    <span className="ai-toggle-label">
                        {togglingAiMode ? "Updating..." : aiEnabled ? "AI Bot: ON" : "AI Bot: OFF"}
                    </span>
                </button>
            </div>

            <div className="settings-sections">
                <div className="settings-card">
                    <h3 className="settings-card-title">Reply Delay</h3>
                    <p className="settings-hint">How long the bot waits before sending a reply, in seconds.</p>

                    <div className="slider-row">
                        <input type="range" min="1" max="300" value={delay} onChange={(e) => setDelay(Number(e.target.value))} className="settings-slider" disabled={loading} />
                        <span className="slider-value">{delay}s</span>
                    </div>

                    <button className="settings-save-btn" onClick={handleSaveDelay} disabled={saving}>
                        {saving ? "Saving..." : "Save Delay"}
                    </button>
                </div>

                <div className="settings-card">
                    <h3 className="settings-card-title">WhatsApp Token</h3>
                    <p className="settings-hint">Your WhatsApp Business API access token.</p>

                    <input type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="EAAxxxxxxxxxxxxxxxxxxxxxxxx" className="settings-input" />

                    <button className="settings-save-btn" onClick={handleSaveToken} disabled={savingToken}>
                        {savingToken ? "Saving..." : "Save Token"}
                    </button>
                </div>

                <div className="settings-card settings-system-card">
                    <h3 className="settings-card-title">System Prompt</h3>
                    <p className="settings-hint">Configure the instructions used by the AI bot.</p>

                    <textarea value={systemprompt} onChange={(e) => setSystemprompt(e.target.value)} placeholder="Enter system prompt..." className="settings-input settings-textarea" rows="12" />

                    <button className="settings-save-btn" onClick={setSystemPrompt} disabled={savingPrompt}>
                        {savingPrompt ? "Saving..." : "Save System Prompt"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Settings;