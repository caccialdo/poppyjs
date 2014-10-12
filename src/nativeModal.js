function NativeModal() {
    return this;
}

var NativeModalPrototype = NativeModal.prototype;

NativeModalPrototype.alert = function (message) {
    this.value = window.alert(message);
    return this;
};

NativeModalPrototype.confirm = function (message) {
    this.value = window.confirm(message);
    return this;
};

NativeModalPrototype.prompt = function (message, value) {
    this.value = window.prompt(message, value);
    return this;
};

NativeModalPrototype.then = function (fulfill, reject) {
    var value = this.value,
        isString = typeof value === "string";

    if (value === null || value === false) {
        // That's a falsy case
        execute(reject);
    } else {
        // That's a truthy case. Call fulfill with the value if there's any.
        execute(fulfill, [isString ? value : undefined]);
    }
};
