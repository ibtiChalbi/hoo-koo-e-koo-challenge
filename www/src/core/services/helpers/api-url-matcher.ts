import { ApiUrlsEnum, apiUrl } from "./api-url";

export function apiUrlMatcher(
  urlName: ApiUrlsEnum,
  args?: { [param: string]: string }
): string {
  const urlArgs = args || {};
  let url = urlName.toString() || "";
  Object.keys(urlArgs).forEach(
    (param) =>
      (url = url
        .replace(/\s/g, "")
        .replace(new RegExp(`{${param}}`, "gi"), () => urlArgs[param]))
  );

  return (url && `${apiUrl}${url}`) || "";
}
