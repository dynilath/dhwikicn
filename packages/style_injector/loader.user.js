// ==UserScript==
// @name         DaggerHeart灰机wiki加载器 - __OUTPUT__
// @namespace    http://tampermonkey.net/
// @version      2025-06-13
// @match        http*://daggerheart.huijiwiki.com/index.php*
// @match        http*://daggerheart.huijiwiki.com/wiki/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=huijiwiki.com
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    const script = document.createElement('script');
    script.src = `http://127.0.0.1:14001/__OUTPUT__?v=${Date.now()}`;
    script.onload = function() {
        script.remove(); // Remove the script element after loading
    };
    document.head.appendChild(script);
})();