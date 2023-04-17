import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <footer>@2023 HelenBassa</footer>
    </>
  );
}
