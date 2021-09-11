export default abstract class EventListenerManager extends EventTarget {
    fireEvent(payload: any) {
        console.log(payload.constructor.name);
        
        this.dispatchEvent(new CustomEvent(payload.constructor.name, {detail: payload}));
    }
}