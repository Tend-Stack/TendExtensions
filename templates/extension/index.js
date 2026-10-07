// Replace with your extension. The panel calls activate(host) and mounts what it returns.
export function activate(host) {
  const el = document.createElement('div');
  el.textContent = 'Hello from My Extension';
  return { mount(target) { target.appendChild(el); }, unmount() { el.remove(); } };
}
