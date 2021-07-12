import ReactGA from "react-ga";

export const useAnalytics = (category = "category") => {
    const trackEvent = (action = "action", label = "label") => {
        ReactGA.event({
            category,
            action,
            label
        });
    };
    return trackEvent;
};
export const analyticsTrack = (category = "category", action = "action", label = "label") => {
    ReactGA.event({
        category,
        action,
        label
    });
};