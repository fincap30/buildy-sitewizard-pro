/* Launch with Buildy Meta pixel helper.
 * Loads fbevents.js and sends events for pixel 1773080567134254
 * (SiteWizard Buildy / LinkingBiz). Do not use the main SiteWizard pixel on this page.
 */
(function () {
  "use strict";

  var PIXEL_ID = "1773080567134254";
  var PLACEHOLDER = !PIXEL_ID || PIXEL_ID === "PIXEL_ID_PENDING";
  var seenPageViews = {};
  var fbqInited = false;

  function randomId(prefix) {
    var bytes = new Uint8Array(12);
    if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(bytes);
    else for (var i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
    var hex = Array.prototype.map.call(bytes, function (b) {
      return ("0" + b.toString(16)).slice(-2);
    }).join("");
    return prefix + "_" + hex;
  }

  function logEvent(name, payload) {
    var entry = { event: name, t: Date.now(), placeholder: PLACEHOLDER };
    if (payload) {
      for (var k in payload) if (Object.prototype.hasOwnProperty.call(payload, k)) entry[k] = payload[k];
    }
    window.__buildyPixelLog = window.__buildyPixelLog || [];
    window.__buildyPixelLog.push(entry);
    try { console.info("[buildy-pixel]", name, entry); } catch (e) {}
    return entry;
  }

  function ensureFbq() {
    if (PLACEHOLDER) return false;
    if (!window.fbq) {
      // Official loader; runs only when the real pixel ID is set.
      !(function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = "2.0";
        n.queue = [];
        t = b.createElement(e);
        t.async = true;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    }
    if (!fbqInited && window.fbq) {
      window.fbq("init", PIXEL_ID);
      fbqInited = true;
    }
    return !!window.fbq;
  }

  function pageView() {
    var path = (location.pathname || "/") .replace(/\/+$/, "") || "/";
    if (seenPageViews[path]) {
      logEvent("PageViewSkipped", { path: path, reason: "duplicate" });
      return;
    }
    seenPageViews[path] = true;
    var eventID = randomId("bpv");
    if (!PLACEHOLDER && ensureFbq()) {
      window.fbq("track", "PageView", {}, { eventID: eventID });
    }
    logEvent("PageView", { path: path, eventID: eventID });
  }

  function lead() {
    var eventID = randomId("bdl");
    if (!PLACEHOLDER && ensureFbq()) {
      window.fbq("track", "Lead", {}, { eventID: eventID });
    }
    logEvent("Lead", { eventID: eventID });
    return eventID;
  }

  function affiliateClick(href) {
    var eventID = randomId("bac");
    var params = { eventID: eventID, href: href || "" };
    if (!PLACEHOLDER && ensureFbq()) {
      window.fbq("trackCustom", "BuildyAffiliateClick", { href: href || "" }, { eventID: eventID });
    }
    logEvent("BuildyAffiliateClick", params);
    return eventID;
  }

  window.__buildyOnRegisterSuccess = function () {
    lead();
  };
  window.__buildyPixel = {
    PIXEL_ID: PIXEL_ID,
    placeholder: PLACEHOLDER,
    pageView: pageView,
    lead: lead,
    affiliateClick: affiliateClick,
    log: function () { return (window.__buildyPixelLog || []).slice(); }
  };

  function hookHistory() {
    var wrap = function (name) {
      var orig = history[name];
      if (typeof orig !== "function") return;
      history[name] = function () {
        var ret = orig.apply(this, arguments);
        try { pageView(); } catch (e) {}
        return ret;
      };
    };
    wrap("pushState");
    wrap("replaceState");
    window.addEventListener("popstate", function () { pageView(); });
  }

  function isAffiliateButton(a) {
    if (!a || !a.getAttribute) return false;
    var href = a.href || a.getAttribute("href") || "";
    if (/buildy\.ai\/?\?aff=xw2bvo1iyNO7/i.test(href)) return true;
    var text = (a.textContent || "").replace(/\s+/g, " ").trim();
    if (/^Try Buildy for free$/i.test(text) && /buildy\.ai/i.test(href)) return true;
    return false;
  }

  function hookAffiliateClicks() {
    document.addEventListener("click", function (event) {
      if (event.defaultPrevented && event.button !== 0) return;
      if (event.button !== 0) return; // left click only
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      var a = event.target && event.target.closest ? event.target.closest("a") : null;
      if (!isAffiliateButton(a)) return;
      if (a.getAttribute("data-buildy-pixel-handled") === "1") return;
      event.preventDefault();
      event.stopPropagation();
      var href = a.href;
      var target = a.target || "_blank";
      affiliateClick(href);
      window.setTimeout(function () {
        a.setAttribute("data-buildy-pixel-handled", "1");
        try {
          if (target === "_blank") window.open(href, "_blank", "noopener,noreferrer");
          else location.href = href;
        } finally {
          window.setTimeout(function () { a.removeAttribute("data-buildy-pixel-handled"); }, 0);
        }
      }, 300);
    }, true);
  }

  function start() {
    hookHistory();
    hookAffiliateClicks();
    pageView();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
