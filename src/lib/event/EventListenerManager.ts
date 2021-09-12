export default abstract class EventListenerManager extends EventTarget {
    fireEvent(payload: any, name?: string) {        
        this.dispatchEvent(new CustomEvent(name ?? payload.constructor.name, {detail: payload}));
    }
}