let byEvent = class byEvent {
    constructor() {
        this.events = {};
    }

    on(name, callback = new Function()) {
        //
        if (!name) return;
        var callbacks = this.events[name] || [];
        callbacks.push(callback);
        this.events[name] = callbacks;
        return this;
    }
    emit(...args) {
        //
        var eventName = args[0];
        if (!eventName) return this;
        var params = [].slice.call(args, 1);
        var callbacks = this.events[eventName];
        if (!callbacks) {
            console.warn(`miss ${eventName} events`);
            return this;
        };
        callbacks.forEach(fn => {
            if (typeof fn == 'function') {
                fn.apply(this, params);
            }
        });
        return this;
    }
    off(event = '', callback) {
        let callbacks = this.events[event];
        this.events[event] = callbacks && callbacks.filter(fn => fn !== callback);
        return this;
    }
    once(name, callback = new Function()) {
        if (!name) return;
        let wrapFanc = (...args) => {
            //保存第一次触发的，之后的触发全部移除off,
            callback.apply(this, args);
            this.off(name, wrapFanc);
        };
        this.on(name, wrapFanc);
        return this;
    }
};

module.exports = byEvent;