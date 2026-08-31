import api from "./api";

// `signal` comes from an AbortController so a rapid date change cancels the
// in-flight request instead of racing it.
export const getstatsoverview = (from, to, signal) => {
    return api.get("/stats/overview", { params: { from, to }, signal });
};
