"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Spinner } from "./Spinner";

function showBusy(label = "Chargement...") {
  const root = document.documentElement;
  root.classList.add("is-busy");
  const text = document.getElementById("app-busy-label");
  if (text) text.textContent = label;
}

function hideBusy() {
  document.documentElement.classList.remove("is-busy");
}

export function NavigationLoader() {
  const pathname = usePathname();

  useEffect(() => {
    hideBusy();
  }, [pathname]);

  useEffect(() => {
    let hideTimer = 0;

    function armHide() {
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(hideBusy, 12000);
    }

    function onPointerDown(event: PointerEvent) {
      if (event.button !== 0) return;
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const link = target.closest("a");
      if (!link) return;
      if (link.target && link.target !== "_self") return;
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) {
        showBusy("Redirection vers le site...");
        return;
      }
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      showBusy("Chargement...");
      armHide();
    }

    document.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      window.clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="app-busy" id="app-busy" role="status" aria-live="polite" aria-label="Chargement">
      <div className="nav-progress"><i /></div>
      <div className="nav-loader-card">
        <Spinner />
        <span id="app-busy-label">Chargement...</span>
      </div>
    </div>
  );
}
