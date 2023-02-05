import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";

export function getUrlCode(): string {
  if (document.location.hash && document.location.hash.startsWith("#code")) {
    try {
      const code = document.location.hash.replace("#code/", "").trim();
      return decompressFromEncodedURIComponent(code) || ""; // will be null on error
    } catch (err) {
      console.error(err);
    }
  }

  return "";
}

export function updateUrl(code: string): void {
  if (code.length === 0) {
    updateLocationHash("");
  } else {
    updateLocationHash(`code/${compressToEncodedURIComponent(code)}`);
  }

  function updateLocationHash(locationHash: string) {
    window.history.replaceState(undefined, "", `#${locationHash}`);
  }
}
