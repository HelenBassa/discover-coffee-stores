import { useEffect, useState, useContext } from "react";
import Head from "next/head";
import Image from "next/image";

import styles from "@/styles/Home.module.css";

import { defaultImgUrl, fetchCoffeeStores, limit } from "@/lib/coffee-store";

import Banner from "@/components/Banner.js";
import Card from "@/components/Card.js";
import useTrackLocation from "@/hooks/use-track-location";
import { ACTION_TYPES, StoreContext } from "@/store/store-context";

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores();

  return {
    props: {
      coffeeStores,
    },
  };
}

export default function Home(props) {
  const { handleTrackLocation, locationErrorMsg, isFindingLocation } =
    useTrackLocation();

  const { dispatch, state } = useContext(StoreContext);
  const { coffeeStores, latLong } = state;

  const [coffeeStoresError, setCoffeeStoresError] = useState(null);

  useEffect(() => {
    async function setCoffeeStoresByLocation() {
      if (latLong) {
        try {
          const response = await fetch(
            `/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=${limit}`
          );

          const coffeeStores = await response.json();

          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: {
              coffeeStores,
            },
          });
          setCoffeeStoresError("");
        } catch (error) {
          console.error({ error });
          setCoffeeStoresError(error.message);
        }
      }
    }

    setCoffeeStoresByLocation();
  }, [latLong]);

  const handleOnBannerBtnClick = () => {
    handleTrackLocation();
  };

  return (
    <>
      <Head>
        <title>Coffee Connoisseur</title>
        <meta name="description" content="Coffee Connoisseur" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? "Locating ..." : "View stores nearby"}
          handleOnClick={handleOnBannerBtnClick}
        />
        {locationErrorMsg && (
          <div className={styles.errorMsg}>
            <b>Something went wrong: &nbsp;</b>
            <i>{locationErrorMsg}</i>
          </div>
        )}
        {coffeeStoresError && (
          <div className={styles.errorMsg}>
            <b>Something went wrong: &nbsp;</b>
            <i>{coffeeStoresError}</i>
          </div>
        )}
        <div className={styles.heroImage}>
          <Image
            className={styles.heroImg}
            alt="hero"
            src="/static/hero-image.png"
            width={600}
            height={300}
            priority
          />
        </div>

        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            {" "}
            <h2 className={styles.heading2}>Stores near me</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((coffeeStore) => (
                <Card
                  key={coffeeStore.id}
                  name={coffeeStore.name}
                  alt={coffeeStore.name}
                  imgUrl={coffeeStore.imgUrl || defaultImgUrl}
                  href={`/coffee-store/${coffeeStore.id}`}
                  className={styles.card}
                />
              ))}
            </div>
          </div>
        )}

        {props.coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            {" "}
            <h2 className={styles.heading2}>
              Warszawa centralna - coffee stores
            </h2>
            <div className={styles.cardLayout}>
              {props.coffeeStores.map((coffeeStore) => (
                <Card
                  key={coffeeStore.id}
                  name={coffeeStore.name}
                  alt={coffeeStore.name}
                  imgUrl={coffeeStore.imgUrl || defaultImgUrl}
                  href={`/coffee-store/${coffeeStore.id}`}
                  className={styles.card}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
