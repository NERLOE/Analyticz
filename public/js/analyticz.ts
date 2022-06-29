declare global {
  interface Window {
    _phantom: any;
    __nightmare: any;
    Cypress: any;
    analyticz?: (event: string) => void;
  }
}

(function () {
  let location = window.location;
  let document = window.document;
  let script = document.currentScript as HTMLScriptElement;
  let apiUrl =
    script.getAttribute("data-api") ||
    new URL(script.src).origin + "/api/event";

  function ignoreEvent(msg: string) {
    console.warn(`Ignoring Event: ${msg}`);
  }

  function logEvent(event: string) {
    if (
      /^localhost$|^127(\.[0-9]+){0,2}\.[0-9]+$|^\[::1?\]$/.test(
        location.hostname
      ) ||
      "file:" === location.protocol
    ) {
      return ignoreEvent("localhost");
    }

    if (
      !(
        window._phantom ||
        window.__nightmare ||
        window.navigator.webdriver ||
        window.Cypress
      )
    ) {
      try {
        if ("true" === window.localStorage.analyticz_ignore)
          return ignoreEvent("localStorage flag");
      } catch (t) {}

      const data = {
        n: event,
        u: location.href,
        d: script.getAttribute("data-domain"),
        r: document.referrer || null,
        w: window.innerWidth,
      };

      const xhr = new XMLHttpRequest();
      xhr.open("POST", apiUrl, true);
      xhr.setRequestHeader("Content-Type", "text/plain");
      xhr.send(JSON.stringify(data));
      xhr.onreadystatechange = () => {
        4 === xhr.readyState;
      };
    }
  }

  function pageView() {
    logEvent("pageView");
  }

  let pushState: History["pushState"];
  let history: History = window.history;

  if (history.pushState && (pushState = history.pushState)) {
    history.pushState = function () {
      pushState.apply(this, arguments as any);
      pageView();
    };
  }

  window.addEventListener("popState", pageView);

  "prerender" === (document.visibilityState as any)
    ? document.addEventListener("visibilitychange", function () {
        "visible" !== document.visibilityState || pageView();
      })
    : pageView();
})();

export {};
