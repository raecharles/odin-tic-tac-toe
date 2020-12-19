function createElemWithAttributes(el, attrs) {
    let elem = document.createElement(el);
    for(var key in attrs) {
      elem.setAttribute(key, attrs[key]);
    }
    return elem;
}

export { createElemWithAttributes }