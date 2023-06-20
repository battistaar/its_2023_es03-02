export function createElement(html) {
    let template = document.createElement('div');
    html = html.trim();
    template.innerHTML = html;
    return template.firstChild;
}