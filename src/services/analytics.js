import ReactGA from "react-ga";

const useAnalytics = (eventType = "event") => {
    const trackEvent = (title = "title", label = "label") => {
        ReactGA.event({
            eventType,
            title,
            label,
        });
    };
    return trackEvent;
};

export default useAnalytics;