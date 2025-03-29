export const getCookies = (name: string) => {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split("=");
    if (cookieName === name) {
      return cookieValue;
    }
  }

  return null;
};

export const setCookie = (name: string, value: string) => {
  //const expiresDate = new Date(Date.now() + expires * 1000);
  document.cookie = `${name}=${value};path=/`;
};

