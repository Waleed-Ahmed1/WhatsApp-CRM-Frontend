import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
    Settings as SettingsIcon,
    Clock,
    KeyRound,
    Bot,
    MessageSquare,
    Eye,
    EyeOff,
} from "lucide-react";
import {
    getdelay as getDelayFromServer,
    setdelay as saveDelayToServer,
    savetoken as setTokentoServer,
    gettoken as getTokenfromServer,
    setsystemprompt,
    getsystemprompt,
    getaimode,
    setaimode,
    setgroqapikey,
    getgroqapikey,
    setOpenAiKey,
    getOpenAiKey
} from "../api/setting";

function Settings() {
    const [delay, setDelay] = useState(5);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    const [token, setToken] = useState("");
    const [savingToken, setSavingToken] = useState(false);
    const [showToken, setShowToken] = useState(false);

    const [apikey, setApiKey] = useState("");
    const [savingapiKey, setsavingApiKey] = useState(false);
    const [showApiKey, setShowApiKey] = useState(false);

    const [openaiKey, setOpenaiKey] = useState("");
    const [savingOpenaiKey, setSavingOpenaiKey] = useState(false);
    const [showOpenaiKey, setShowOpenaiKey] = useState(false);

    const [systemprompt, setSystemprompt] = useState("");
    const [savingPrompt, setSavingPrompt] = useState(false);

    const [aiEnabled, setAiEnabled] = useState(true);
    const [loadingAiMode, setLoadingAiMode] = useState(true);
    const [togglingAiMode, setTogglingAiMode] = useState(false);

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
            toast.error(err.response?.data?.message || "Response Delay cannot be Updated!");
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
        setSavingToken(true);
        try {
            const res = await setTokentoServer(token);
            toast.success(res.data.message || "Token Saved Successfully!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Token cannot be Updated!");
        } finally {
            setSavingToken(false);
        }
    };

    useEffect(() => {
        const fetchApiKey = async () => {
            try {
                const res = await getgroqapikey();
                setApiKey(res.data.groqApiKey);
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to Fetch the Groq API Key");
            }
        };
        fetchApiKey();
    }, []);

    const handleApiKey = async () => {
        setsavingApiKey(true);
        try {
            const res = await setgroqapikey(apikey);
            toast.success(res.data.message || "Groq API Key Saved Successfully!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Groq API Key cannot be Updated!");
        } finally {
            setsavingApiKey(false);
        }
    };

    useEffect(() => {
        const fetchOpenaiKey = async () => {
            try {
                const res = await getOpenAiKey();
                setOpenaiKey(res.data.groqOpenAiKey);
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to Fetch the Groq OpenAI Key");
            }
        };
        fetchOpenaiKey();
    }, []);

    const handleOpenaiKey = async () => {
        setSavingOpenaiKey(true);
        try {
            const res = await setOpenAiKey(openaiKey);
            toast.success(res.data.message || "Groq OpenAI Key Saved Successfully!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Groq OpenAI Key cannot be Updated!");
        } finally {
            setSavingOpenaiKey(false);
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
        <div className="h-full w-full overflow-y-auto bg-[#EAF7F4] px-4 py-6 sm:px-8">

            {/* Header */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="flex items-center gap-2 text-xl font-semibold text-[#1F2937]">
                        <SettingsIcon size={20} className="text-[#0EA894]" />
                        Settings
                    </h1>
                    <p className="text-sm text-[#6B7280]">
                        Configure bot behaviour and WhatsApp connection
                    </p>
                </div>

                <button
                    onClick={handleToggleAiMode}
                    disabled={loadingAiMode || togglingAiMode}
                    className={`flex items-center gap-2.5 rounded-full py-2 pl-3 pr-4 text-sm font-medium shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition disabled:opacity-60 ${
                        aiEnabled ? "bg-[#0B6F60] text-white" : "bg-white text-[#6B7280]"
                    }`}
                >
                    <Bot size={16} />
                    <span className={`relative h-5 w-9 flex-none rounded-full transition ${aiEnabled ? "bg-white/30" : "bg-[#E5E7EB]"}`}>
                        <span
                            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
                                aiEnabled ? "left-4" : "left-0.5"
                            } ${!aiEnabled && "bg-[#9CA3AF]"}`}
                        />
                    </span>
                    {togglingAiMode ? "Updating..." : aiEnabled ? "AI Bot: ON" : "AI Bot: OFF"}
                </button>
            </div>

            <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 lg:grid-cols-2">

                {/* Reply Delay */}
                <div className="rounded-2xl bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-[#1F2937]">
                        <Clock size={15} className="text-[#0EA894]" />
                        Reply Delay
                    </h3>
                    <p className="mb-4 mt-1 text-xs text-[#6B7280]">
                        How long the bot waits before sending a reply, in seconds.
                    </p>

                    <div className="mb-4 flex items-center gap-3">
                        <input
                            type="range"
                            min="1"
                            max="300"
                            value={delay}
                            onChange={(e) => setDelay(Number(e.target.value))}
                            disabled={loading}
                            className="h-1.5 w-full flex-1 cursor-pointer appearance-none rounded-full bg-[#E5E7EB] accent-[#0EA894] disabled:cursor-not-allowed"
                        />
                        <span className="w-14 flex-none rounded-full bg-[#0EA894]/10 py-1 text-center text-xs font-semibold text-[#0B6F60]">
                            {delay}s
                        </span>
                    </div>

                    <button
                        onClick={handleSaveDelay}
                        disabled={saving}
                        className="rounded-xl bg-[#0B6F60] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0B8A79] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {saving ? "Saving..." : "Save Delay"}
                    </button>
                </div>

                {/* WhatsApp Token */}
                <div className="rounded-2xl bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-[#1F2937]">
                        <KeyRound size={15} className="text-[#0EA894]" />
                        WhatsApp Token
                    </h3>
                    <p className="mb-4 mt-1 text-xs text-[#6B7280]">
                        Your WhatsApp Business API access token.
                    </p>

                    <div className="relative mb-4">
                        <input
                            type={showToken ? "text" : "password"}
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            placeholder="EAAxxxxxxxxxxxxxxxxxxxxxxxx"
                            className="h-11 w-full rounded-xl border border-[#E5E7EB] px-4 pr-11 text-sm text-[#1F2937] outline-none transition-all duration-200 focus:border-[#0EA894] focus:ring-2 focus:ring-[#0EA894]/20"
                        />
                        <button
                            type="button"
                            onClick={() => setShowToken((p) => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] transition hover:text-[#0B6F60]"
                        >
                            {showToken ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    <button
                        onClick={handleSaveToken}
                        disabled={savingToken}
                        className="rounded-xl bg-[#0B6F60] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0B8A79] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {savingToken ? "Saving..." : "Save Token"}
                    </button>
                </div>

                {/* Groq API Key */}
                <div className="rounded-2xl bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-[#1F2937]">
                        <KeyRound size={15} className="text-[#0EA894]" />
                        Groq API Key
                    </h3>
                    <p className="mb-4 mt-1 text-xs text-[#6B7280]">
                        Your Groq API Key.
                    </p>

                    <div className="relative mb-4">
                        <input
                            type={showApiKey ? "text" : "password"}
                            value={apikey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Groq API Key"
                            className="h-11 w-full rounded-xl border border-[#E5E7EB] px-4 pr-11 text-sm text-[#1F2937] outline-none transition-all duration-200 focus:border-[#0EA894] focus:ring-2 focus:ring-[#0EA894]/20"
                        />
                        <button
                            type="button"
                            onClick={() => setShowApiKey((p) => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] transition hover:text-[#0B6F60]"
                        >
                            {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    <button
                        onClick={handleApiKey}
                        disabled={savingapiKey}
                        className="rounded-xl bg-[#0B6F60] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0B8A79] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {savingapiKey ? "Saving..." : "Save Groq API Key"}
                    </button>
                </div>

                {/* Groq OpenAI Key */}
                <div className="rounded-2xl bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-[#1F2937]">
                        <KeyRound size={15} className="text-[#0EA894]" />
                        Groq OpenAI API Key
                    </h3>
                    <p className="mb-4 mt-1 text-xs text-[#6B7280]">
                        Your Groq key for the OpenAI-compatible API.
                    </p>

                    <div className="relative mb-4">
                        <input
                            type={showOpenaiKey ? "text" : "password"}
                            value={openaiKey}
                            onChange={(e) => setOpenaiKey(e.target.value)}
                            placeholder="Groq OpenAI API Key"
                            className="h-11 w-full rounded-xl border border-[#E5E7EB] px-4 pr-11 text-sm text-[#1F2937] outline-none transition-all duration-200 focus:border-[#0EA894] focus:ring-2 focus:ring-[#0EA894]/20"
                        />
                        <button
                            type="button"
                            onClick={() => setShowOpenaiKey((p) => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] transition hover:text-[#0B6F60]"
                        >
                            {showOpenaiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    <button
                        onClick={handleOpenaiKey}
                        disabled={savingOpenaiKey}
                        className="rounded-xl bg-[#0B6F60] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0B8A79] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {savingOpenaiKey ? "Saving..." : "Save OpenAI Key"}
                    </button>
                </div>

                {/* System Prompt */}
                <div className="rounded-2xl bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.06)] lg:col-span-2">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-[#1F2937]">
                        <MessageSquare size={15} className="text-[#0EA894]" />
                        System Prompt
                    </h3>
                    <p className="mb-4 mt-1 text-xs text-[#6B7280]">
                        Configure the instructions used by the AI bot.
                    </p>

                    <textarea
                        value={systemprompt}
                        onChange={(e) => setSystemprompt(e.target.value)}
                        placeholder="Enter system prompt..."
                        rows={12}
                        className="mb-4 w-full resize-none rounded-xl border border-[#E5E7EB] p-4 text-sm text-[#1F2937] outline-none transition-all duration-200 focus:border-[#0EA894] focus:ring-2 focus:ring-[#0EA894]/20"
                    />

                    <button
                        onClick={setSystemPrompt}
                        disabled={savingPrompt}
                        className="rounded-xl bg-[#0B6F60] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0B8A79] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {savingPrompt ? "Saving..." : "Save System Prompt"}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Settings;