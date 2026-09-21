import { configureRuntime, loadProfile } from './src/RuntimeContext.js';
import { createGameConfig } from './src/GameConfig.js';
import { audio } from './src/AudioManager.js';

const STYLE_ID = 'tend-neon-cyber-man-style';

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .ncm-root{position:relative;width:100%;height:100%;min-height:0;overflow:hidden;background:#05070d;outline:none;touch-action:none;user-select:none;-webkit-user-select:none;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}
    .ncm-root canvas{position:absolute!important;left:50%!important;top:50%!important;transform:translate(-50%,-50%)!important;margin:0!important;display:block;max-width:100%;max-height:100%;filter:drop-shadow(0 28px 70px rgba(0,0,0,.66));touch-action:none}
    .ncm-loading{position:absolute;inset:0;z-index:20;display:grid;place-items:center;background:radial-gradient(circle at 50% 42%,rgba(0,243,255,.09),transparent 26%),radial-gradient(circle at 66% 62%,rgba(255,0,127,.08),transparent 30%),#05070d;color:#f4fbff}
    .ncm-loader-card{width:min(430px,calc(100% - 42px));padding:34px 30px;border:1px solid rgba(0,243,255,.22);border-radius:24px;background:rgba(5,13,23,.88);box-shadow:0 28px 80px rgba(0,0,0,.55),inset 0 1px rgba(255,255,255,.05);text-align:center;backdrop-filter:blur(16px)}
    .ncm-loader-orb{width:62px;height:62px;margin:0 auto 22px;border-radius:50%;background:radial-gradient(circle at 42% 38%,#fff 0 8%,#8ffcff 12%,#00f3ff 28%,rgba(0,243,255,.18) 54%,transparent 64%);box-shadow:0 0 26px #00f3ff,0 0 54px rgba(255,0,127,.28);animation:ncm-pulse 1.05s ease-in-out infinite alternate}
    .ncm-loading b{display:block;font-size:15px;letter-spacing:3px}.ncm-loading span{display:block;margin-top:8px;color:#6f8199;font-size:10px;letter-spacing:1.4px}
    .ncm-track{height:4px;margin-top:24px;border-radius:99px;background:rgba(255,255,255,.07);overflow:hidden}.ncm-track i{display:block;width:16%;height:100%;border-radius:inherit;background:linear-gradient(90deg,#00f3ff,#8b5cf6,#ff007f);box-shadow:0 0 18px #00f3ff;animation:ncm-load 1.1s ease-in-out infinite}
    .ncm-error{color:#ff6b82!important;line-height:1.5}
    @keyframes ncm-pulse{to{transform:scale(1.13);filter:brightness(1.25)}}
    @keyframes ncm-load{0%{transform:translateX(-120%)}100%{transform:translateX(650%)}}
  `;
  document.head.appendChild(style);
}

function loadingMarkup() {
  return `<div class="ncm-loading"><div class="ncm-loader-card"><div class="ncm-loader-orb"></div><b>NEON CYBER-MAN</b><span>INITIALIZING PHASER 4 CYBER-GRID</span><div class="ncm-track"><i></i></div></div></div>`;
}

export default function activate(host) {
  if (!host?.runtime) throw new Error('Neon Cyber-Man requires tend.host Runtime API 1.');
  if (!host?.storage) throw new Error('Neon Cyber-Man requires the storage permission.');
  ensureStyles();
  let game = null;
  let root = null;
  let disposed = false;

  return {
    mount(el) {
      disposed = false;
      el.innerHTML = '';
      el.style.cssText = 'width:100%;height:100%;overflow:hidden;background:#05070d;';
      root = document.createElement('div');
      root.className = 'ncm-root';
      root.tabIndex = 0;
      root.innerHTML = loadingMarkup();
      el.appendChild(root);

      Promise.all([
        loadProfile(host.storage),
        host.runtime.require('phaser@4')
      ]).then(([, phaserRuntime]) => {
        if (disposed || !root?.isConnected) return;
        const Phaser = phaserRuntime.Phaser;
        configureRuntime({ host, Phaser, phaserRuntime });
        root.innerHTML = '';
        game = phaserRuntime.createGame(createGameConfig(Phaser, root));
        try { root.focus({ preventScroll: true }); } catch { root.focus(); }
      }).catch((error) => {
        console.error('Neon Cyber-Man failed to initialize', error);
        if (!root) return;
        root.innerHTML = `<div class="ncm-loading"><div class="ncm-loader-card"><b class="ncm-error">CYBER-GRID OFFLINE</b><span>${String(error?.message || error)}</span><span>Confirm tend.host exposes runtime module phaser@4.</span></div></div>`;
      });
    },

    unmount() {
      disposed = true;
      if (game?.destroy) {
        try { game.destroy(true); } catch {}
      }
      game = null;
      audio.close();
      if (root) root.innerHTML = '';
      root = null;
    }
  };
}
