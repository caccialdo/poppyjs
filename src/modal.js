function Modal(cfg) {
    if (!controller) throw new Error("You need to create an instance of Poppy first.");
    this.promise = this.create(cfg);
    return this;
}

var ModalPrototype = Modal.prototype;

ModalPrototype.create = function (cfg) {
    var promise = {
            state: "pending",
            cb: {
                f: [],
                r: []
            }
        },
        node = this.node = this.render(cfg);

    if (cfg.value !== undefined) this.input = node.querySelector("input");

    modals[count++] = this;

    overlay.style.zIndex = findMaxZIndex().index + 1;
    overlay.appendChild(node);
    controller.show();

    return promise;
};

ModalPrototype.then = function (fulfill, reject) {
    var promise = this.promise,
        value = promise.value;

    switch (promise.state) {
        case "pending":
            if (fulfill) promise.cb.f.push(fulfill);
            if (reject) promise.cb.r.push(reject);
            return promise;
        case "fulfilled":
            execute(fulfill, [value]);
            return promise;
        case "rejected":
            execute(reject);
            return promise;
    }
};

ModalPrototype.getState = function () {
    return this.promise.state;
};

ModalPrototype.fulfillAll = function () {
    var promise = this.promise;

    promise.state = "fulfilled";
    promise.value = this.input ? this.input.value : undefined;
    promise.cb.f.forEach(function (fn) {
        execute(fn, [promise.value]);
    });

    promise.cb = {f: [], r: []};
};

ModalPrototype.rejectAll = function () {
    var promise = this.promise;

    promise.state = "rejected";
    promise.cb.r.forEach(execute);
    promise.cb = {f: [], r: []};
};

ModalPrototype.render = function (cfg) {
    var markup,
        modalNode = document.createElement("div");

    modalNode.className = ["poppy-modal", cfg.class].join(" ").trim();

    markup = "" +
        "<div class='poppy-body'>" + cfg.body + "</div>" +
        (cfg.value === undefined ? "" : '<input type="text" value="' + cfg.value + '"/>') +
        "<div class='poppy-buttons'>" +
            cfg.buttons.map(function (button) {
                return '<button data-id="' + count + '" data-action="' + button.action + '">' + button.label + "</button>";
            }).join("") +
        "</div>";

    modalNode.innerHTML = markup;
    return modalNode;
};

ModalPrototype.destroy = function () {
    overlay.removeChild(this.node);
};