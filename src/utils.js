function bindEvent(node, type, handler, context) {
    if (context) handler = handler.bind(context);
    node.addEventListener(type, handler);
    return {
        detach: node.removeEventListener.bind(node, type, handler)
    }
}

/**
 * Original code from Chosen
 * cf. https://github.com/harvesthq/chosen/blob/master/coffee/lib/abstract-chosen.coffee#L260
 */
function browserIsNotSupported (navigator) {
    var isIE = navigator.appName === "Microsoft Internet Explorer" && document.documentMode < 9,
        isIOS = /iP(od|hone)/i.test(navigator.userAgent),
        isAndroid = /Android/i.test(navigator.userAgent);

    return isIE || isIOS || isAndroid;
}

/**
 * Quickly finds the node with the highest z-index in the DOM.
 * Takes up to 10-12ms to return on complex web pages like facebook.com.
 *
 * @returns {{node: Node, index: Number}}
 */
function findMaxZIndex() {
    var i, zIndex, node,
        highest = 0,
        all = document.querySelectorAll("body *");

    for (i = all.length - 1; i >= 0; i--) {
        // Bitwise NOT is the fastest way to cast a number
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

function execute (fn, args) {
    if (typeof fn === "function") fn.apply(this, args || []);
}