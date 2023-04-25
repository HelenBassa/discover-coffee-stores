import StoreProvider from "@/store/store-context";

import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <StoreProvider>
      <Component {...pageProps} />
      <footer>@2023 HelenBassa</footer>
    </StoreProvider>
  );
}
