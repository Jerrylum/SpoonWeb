export default abstract class EventListenerManager extends EventTarget {
    // readonly allListeners: Set<SEventListener> = new Set();

    // addEventListener(listener: SEventListener) {
    //     this.allListeners.add(listener);
    // }

    // removeEventListener(listener: SEventListener) {
    //     this.allListeners.delete(listener);
    // }

    // removeEventListeners(classname: string) {
    //     this.allListeners.forEach((listener) => {
    //         if (listener.constructor.name === classname)
    //             this.allListeners.delete(listener);
    //     })
    // }

    // fireEvent(...args: any[]) {
    //     try {

    //         function getFunctions(toCheck: any) {
    //             const props = [];
    //             let obj = toCheck;
    //             do {
    //                 props.push(...Object.getOwnPropertyNames(obj));
    //             } while (obj = Object.getPrototypeOf(obj));
                
    //             return props.filter((e, i, arr) => { 
    //                if (e!=arr[i+1] && typeof toCheck[e] == 'function') return true;
    //             });
    //         }
    //         var event = document.createEvent("HTMLEvents");
            

    //         for (var listener in this.allListeners) {

    //         }
    //     } catch (error) {

    //     }
    // }

    fireEvent(payload: any) {
        this.dispatchEvent(new CustomEvent(payload.constructor.name, {detail: payload}));
    }
}