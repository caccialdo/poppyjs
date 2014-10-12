var styleTag, overlay, modals, count, controller, handles;

/**
 * Singleton controller responsible for creating/managing modals.
 */
function Poppy (cfg) {
    if (controller) return controller;

    if (browserIsNotSupported(window.navigator)) return this.fallback();

    cfg = cfg || {};
    this.cfg = {
        theme: cfg.theme || "default"
    };

    this.injectStyle();
    this.createOverlay();
    this.bind();
    modals = this.modals = {};
    count = 0;
    controller = this;
    return this;
}

var PoppyPrototype = Poppy.prototype;

PoppyPrototype.fallback = function () {
    controller = new NativeModal();
    return controller;
};

PoppyPrototype.injectStyle = function () {
    styleTag = document.createElement("style");
    styleTag.type = "text/css";
    styleTag.innerHTML = '{{poppy.min.css}}';
    document.head.insertBefore(styleTag, document.head.firstElementChild);
};

PoppyPrototype.createOverlay = function () {
    overlay = document.createElement("div");
    overlay.className = "poppy-overlay poppy-hidden " + this.cfg.theme;
    document.body.appendChild(overlay);
};

PoppyPrototype.bind = function () {
    handles = [
        bindEvent(overlay, "click", this.onClick, this),
        bindEvent(overlay, "keydown", this.onKey, this)
    ];
};

PoppyPrototype.onClick = function (e) {
    var target = e.target;

    if (target.nodeName === "BUTTON" && target.parentNode.classList.contains("poppy-buttons")) {
        this.onButtonClick(target);
    }
};

PoppyPrototype.onButtonClick = function (button) {
    var id = button.getAttribute("data-id"),
        action = button.getAttribute("data-action"),
        modal = modals[id];

    if (action === "ok") {
        modal.fulfillAll();
    } else if (action === "cancel") {
        modal.rejectAll();
    }

    this.hide();
    modal.destroy();
};

PoppyPrototype.onKey = function (e) {
    var button,
        target = e.target;

    if (target.nodeName !== "INPUT") return;
    switch (e.keyCode) {
        case 13: // Enter
            button = target.parentNode.querySelector("[data-action=ok]");
            break;
        case 27: // Escape
            button = target.parentNode.querySelector("[data-action=cancel]");
            break;
    }
    if (button) this.onButtonClick(button);
};

PoppyPrototype.show = function () {
    overlay.classList.remove("poppy-hidden");
};

PoppyPrototype.hide = function () {
    if (!this.somePending()) overlay.classList.add("poppy-hidden");
};

PoppyPrototype.somePending = function () {
    return Object.keys(modals).some(function (id) {
        return modals[id].getState() === "pending";
    });
};

PoppyPrototype.alert = function (message, type) {
    type = type || "warning";

    var cfg = {
        body: message,
        class: type,
        buttons: [
            {label: "Okay", action: "ok"}
        ]
    };

    return new Modal(cfg);
};

PoppyPrototype.confirm = function (message) {
    var cfg = {
        body: message,
        buttons: [
            {label: "Cancel", action: "cancel"},
            {label: "Okay", action: "ok"}
        ]
    };

    return new Modal(cfg);
};

PoppyPrototype.prompt = function (message, value) {
    var cfg = {
        body: message,
        value: value,
        buttons: [
            {label: "Cancel", action: "cancel"},
            {label: "Okay", action: "ok"}
        ]
    };

    return new Modal(cfg);
};

PoppyPrototype.custom = function (cfg) {
    return new Modal(cfg);
};

PoppyPrototype.destroy = function () {
    handles.forEach(function (handle) {
        handle.detach();
    });
    overlay.parentNode.removeChild(overlay);
    document.head.removeChild(styleTag);

    styleTag = overlay = modals = count = controller = handles = undefined;
};

window.Poppy = Poppy;