declare global {
  interface Window {
    _phantom: any;
    __nightmare: any;
    Cypress: any;
    analyticz?: (event: LogEvent, options?: { props: { url: string } }) => void;
  }
}

(function () {
  "use strict";

  let location = window.location;
  let document = window.document;

  let scriptEl = document.currentScript as HTMLScriptElement;
  let endpoint =
    scriptEl.getAttribute("data-api") ||
    new URL(scriptEl.src).origin + "/api/event";

  function warn(msg: string) {
    console.warn(`Ignoring Event: ${msg}`);
  }

  function trigger(event: LogEvent, options?: any) {
    if (
      /^localhost$|^127(\.[0-9]+){0,2}\.[0-9]+$|^\[::1?\]$/.test(
        location.hostname
      ) ||
      "file:" === location.protocol
    ) {
      return warn("localhost");
    }

    if (
      window._phantom ||
      window.__nightmare ||
      window.navigator.webdriver ||
      window.Cypress
    )
      return;

    try {
      if (window.localStorage.analyticz_ignore === "true") {
        return warn("localStorage flag");
      }
    } catch (e) {}

    const data = {
      n: event,
      u: location.href,
      d: scriptEl.getAttribute("data-domain"),
      r: document.referrer || null,
      w: window.innerWidth,
    };

    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint, true);
    xhr.setRequestHeader("Content-Type", "text/plain");
    xhr.send(JSON.stringify(data));
    xhr.onreadystatechange = () => {
      4 === xhr.readyState;
    };
  }

  let lastPage: string;

  function page() {
    if (lastPage === location.pathname) return;
    lastPage = location.pathname;
    trigger("pageView");
  }

  let his: History = window.history;

  if (his.pushState) {
    let ogPushState: History["pushState"] = his.pushState;
    his.pushState = function () {
      ogPushState.apply(this, arguments as any);
      page();
    };
  }

  window.addEventListener("popstate", page);

  function handleVisibilityChange() {
    if (!lastPage && document.visibilityState === "visible") {
      page();
    }
  }

  if ((document.visibilityState as any) === "prerender") {
    document.addEventListener("visibilitychange", handleVisibilityChange);
  } else {
    page();
  }
})();

export {};
