/* Poppy v0.5.0 | (c) 2014 by Arnaud Ceccaldi | MIT License */
(function() {
    function bindEvent(node, type, handler, context) {
        if (context) handler = handler.bind(context);
        node.addEventListener(type, handler);
        return {
            detach: node.removeEventListener.bind(node, type, handler)
        };
    }
    function browserIsNotSupported(navigator) {
        var isIE = navigator.appName === "Microsoft Internet Explorer" && document.documentMode < 9, isIOS = /iP(od|hone)/i.test(navigator.userAgent), isAndroid = /Android/i.test(navigator.userAgent);
        return isIE || isIOS || isAndroid;
    }
    function findMaxZIndex() {
        var i, zIndex, node, highest = 0, all = document.querySelectorAll("body *");
        for (i = all.length - 1; i >= 0; i--) {
            zIndex = ~~window.getComputedStyle(all[i]).zIndex;
            if (zIndex > highest) {
                highest = zIndex;
                node = all[i];
            }
        }
        return {
            node: node,
            index: highest
        };
    }
    function execute(fn, args) {
        if (typeof fn === "function") fn.apply(this, args || []);
    }
    function Modal(cfg) {
        if (!controller) throw new Error("You need to create an instance of Poppy first.");
        this.promise = this.create(cfg);
        return this;
    }
    var ModalPrototype = Modal.prototype;
    ModalPrototype.create = function(cfg) {
        var promise = {
            state: "pending",
            cb: {
                f: [],
                r: []
            }
        }, node = this.node = this.render(cfg);
        if (cfg.value !== undefined) this.input = node.querySelector("input");
        modals[count++] = this;
        overlay.style.zIndex = findMaxZIndex().index + 1;
        overlay.appendChild(node);
        controller.show();
        return promise;
    };
    ModalPrototype.then = function(fulfill, reject) {
        var promise = this.promise, value = promise.value;
        switch (promise.state) {
          case "pending":
            if (fulfill) promise.cb.f.push(fulfill);
            if (reject) promise.cb.r.push(reject);
            return promise;

          case "fulfilled":
            execute(fulfill, [ value ]);
            return promise;

          case "rejected":
            execute(reject);
            return promise;
        }
    };
    ModalPrototype.getState = function() {
        return this.promise.state;
    };
    ModalPrototype.fulfillAll = function() {
        var promise = this.promise;
        promise.state = "fulfilled";
        promise.value = this.input ? this.input.value : undefined;
        promise.cb.f.forEach(function(fn) {
            execute(fn, [ promise.value ]);
        });
        promise.cb = {
            f: [],
            r: []
        };
    };
    ModalPrototype.rejectAll = function() {
        var promise = this.promise;
        promise.state = "rejected";
        promise.cb.r.forEach(execute);
        promise.cb = {
            f: [],
            r: []
        };
    };
    ModalPrototype.render = function(cfg) {
        var markup, modalNode = document.createElement("div");
        modalNode.className = [ "poppy-modal", cfg.class ].join(" ").trim();
        markup = "" + "<div class='poppy-body'>" + cfg.body + "</div>" + (cfg.value === undefined ? "" : '<input type="text" value="' + cfg.value + '"/>') + "<div class='poppy-buttons'>" + cfg.buttons.map(function(button) {
            return '<button data-id="' + count + '" data-action="' + button.action + '">' + button.label + "</button>";
        }).join("") + "</div>";
        modalNode.innerHTML = markup;
        return modalNode;
    };
    ModalPrototype.destroy = function() {
        overlay.removeChild(this.node);
    };
    function NativeModal() {
        return this;
    }
    var NativeModalPrototype = NativeModal.prototype;
    NativeModalPrototype.alert = function(message) {
        this.value = window.alert(message);
        return this;
    };
    NativeModalPrototype.confirm = function(message) {
        this.value = window.confirm(message);
        return this;
    };
    NativeModalPrototype.prompt = function(message, value) {
        this.value = window.prompt(message, value);
        return this;
    };
    NativeModalPrototype.then = function(fulfill, reject) {
        var value = this.value, isString = typeof value === "string";
        if (value === null || value === false) {
            execute(reject);
        } else {
            execute(fulfill, [ isString ? value : undefined ]);
        }
    };
    var styleTag, overlay, modals, count, controller, handles;
    function Poppy(cfg) {
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
    PoppyPrototype.fallback = function() {
        controller = new NativeModal();
        return controller;
    };
    PoppyPrototype.injectStyle = function() {
        styleTag = document.createElement("style");
        styleTag.type = "text/css";
        styleTag.innerHTML = ".poppy-overlay{position:fixed;top:0;left:0;right:0;bottom:0}.poppy-overlay *,.poppy-overlay :before,.poppy-overlay :after{box-sizing:border-box}.poppy-overlay .poppy-modal{width:400px;margin:0 auto}.poppy-hidden{display:none;visibility:hidden}";
        document.head.insertBefore(styleTag, document.head.firstElementChild);
    };
    PoppyPrototype.createOverlay = function() {
        overlay = document.createElement("div");
        overlay.className = "poppy-overlay poppy-hidden " + this.cfg.theme;
        document.body.appendChild(overlay);
    };
    PoppyPrototype.bind = function() {
        handles = [ bindEvent(overlay, "click", this.onClick, this), bindEvent(overlay, "keydown", this.onKey, this) ];
    };
    PoppyPrototype.onClick = function(e) {
        var target = e.target;
        if (target.nodeName === "BUTTON" && target.parentNode.classList.contains("poppy-buttons")) {
            this.onButtonClick(target);
        }
    };
    PoppyPrototype.onButtonClick = function(button) {
        var id = button.getAttribute("data-id"), action = button.getAttribute("data-action"), modal = modals[id];
        if (action === "ok") {
            modal.fulfillAll();
        } else if (action === "cancel") {
            modal.rejectAll();
        }
        this.hide();
        modal.destroy();
    };
    PoppyPrototype.onKey = function(e) {
        var button, target = e.target;
        if (target.nodeName !== "INPUT") return;
        switch (e.keyCode) {
          case 13:
            button = target.parentNode.querySelector("[data-action=ok]");
            break;

          case 27:
            button = target.parentNode.querySelector("[data-action=cancel]");
            break;
        }
        if (button) this.onButtonClick(button);
    };
    PoppyPrototype.show = function() {
        overlay.classList.remove("poppy-hidden");
    };
    PoppyPrototype.hide = function() {
        if (!this.somePending()) overlay.classList.add("poppy-hidden");
    };
    PoppyPrototype.somePending = function() {
        return Object.keys(modals).some(function(id) {
            return modals[id].getState() === "pending";
        });
    };
    PoppyPrototype.alert = function(message, type) {
        type = type || "warning";
        var cfg = {
            body: message,
            "class": type,
            buttons: [ {
                label: "Okay",
                action: "ok"
            } ]
        };
        return new Modal(cfg);
    };
    PoppyPrototype.confirm = function(message) {
        var cfg = {
            body: message,
            buttons: [ {
                label: "Cancel",
                action: "cancel"
            }, {
                label: "Okay",
                action: "ok"
            } ]
        };
        return new Modal(cfg);
    };
    PoppyPrototype.prompt = function(message, value) {
        var cfg = {
            body: message,
            value: value,
            buttons: [ {
                label: "Cancel",
                action: "cancel"
            }, {
                label: "Okay",
                action: "ok"
            } ]
        };
        return new Modal(cfg);
    };
    PoppyPrototype.custom = function(cfg) {
        return new Modal(cfg);
    };
    PoppyPrototype.destroy = function() {
        handles.forEach(function(handle) {
            handle.detach();
        });
        overlay.parentNode.removeChild(overlay);
        document.head.removeChild(styleTag);
        styleTag = overlay = modals = count = controller = handles = undefined;
    };
    window.Poppy = Poppy;
})();