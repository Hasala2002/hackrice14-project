/* eslint-disable react-refresh/only-export-components */
function createPubSub() {
    const events = {};

    async function publish(name, data) {
        const handlers = events[name];
        if (handlers == null) return false;

        // Make a snapshot of handlers to prevent mutations during execution
        await Promise.all(handlers.slice().map(handler => handler(data)));
        return true;
    }

    function unsubscribe(name, handler) {
        const handlers = events[name];
        if (handlers == null) return;

        const index = handlers.indexOf(handler);
        if (index !== -1) {
            handlers.splice(index, 1);
        }
    }

    function subscribe(name, handler) {
        if (events[name] == null) {
            events[name] = [];
        }
        events[name].push(handler);

        return () => unsubscribe(name, handler);
    }

    function hasSubscriptions(name) {
        if (events[name] == null) {
            return 0;
        }
        return events[name].length;
    }

    return {
        publish,
        subscribe,
        hasSubscriptions,
    };
}

export default createPubSub;
export const PubSub = createPubSub;
