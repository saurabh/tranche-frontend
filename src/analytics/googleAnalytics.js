import ReactGA from "react-ga";

const useAnalytics = (category = "category") => {
    const trackEvent = (action = "action", label = "label") => {
        ReactGA.event({
            category,
            action,
            label
        });
    };
    return trackEvent;
};

export default useAnalytics;