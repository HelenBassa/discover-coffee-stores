import Head from "next/head";
import { useRouter } from "next/router";

const Dynamic = () => {
  const router = useRouter();
  const { dynamic } = router.query;
  return (
    <div>
      <Head>
        <title>{dynamic}</title>
      </Head>
      Page {dynamic}
    </div>
  );
};

export default Dynamic;
