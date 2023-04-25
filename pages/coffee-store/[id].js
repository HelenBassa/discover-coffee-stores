import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import useSWR from "swr";

import cls from "classnames";

import styles from "@/styles/CoffeeStores.module.css";

import { defaultImgUrl, fetchCoffeeStores } from "@/lib/coffee-store";
import { isEmpty, fetcher } from "@/utils";

import { StoreContext } from "@/store/store-context";

export async function getStaticProps(staticProps) {
  const params = staticProps.params;

  const coffeeStores = await fetchCoffeeStores();

  const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
    return coffeeStore.id.toString() === params.id;
  });

  return {
    props: {
      coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
    },
  };
}

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores();

  const paths = coffeeStores.map((coffeeStore) => {
    return {
      params: {
        id: coffeeStore.id.toString(),
      },
    };
  });

  return {
    paths,
    fallback: true, // false - return 404 page
  };
}

const CoffeeStore = (initialProps) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading ...</div>;
  }

  const id = router.query.id;

  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);

  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  const handleCreateCoffeeStore = async (coffeeStore) => {
    try {
      const { id, name, address, distance, voting, imgUrl } = coffeeStore;
      const response = await fetch("/api/createCoffeeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          address: address || "",
          distance,
          voting: 0,
          imgUrl,
        }),
      });
    } catch (error) {
      console.error("Error creating coffee store", error);
    }
  };

  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const coffeeStoreFromContext = coffeeStores.find((coffeeStore) => {
          return coffeeStore.id.toString() === id;
        });
        if (coffeeStoreFromContext) {
          setCoffeeStore(coffeeStoreFromContext);
          handleCreateCoffeeStore(coffeeStoreFromContext);
        }
      }
    } else {
      //SSG
      handleCreateCoffeeStore(initialProps.coffeeStore);
    }
  }, [id, initialProps, initialProps.coffeeStore]);

  const { name, address, distance, imgUrl } = coffeeStore;

  const [votingCount, setVotingCount] = useState(0);

  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

  useEffect(() => {
    if (data && data.length > 0) {
      setCoffeeStore(data[0]);

      setVotingCount(data[0].voting);
    }
  }, [data]);

  const handleUpVoteButton = async () => {
    try {
      const response = await fetch("/api/upvoteCoffeeStoreById", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      const dbCoffeeStore = await response.json();
      if (dbCoffeeStore && dbCoffeeStore.length > 0) {
        let count = votingCount + 1;
        setVotingCount(count);
      }
    } catch (error) {
      console.error("Error upvoting coffee store", error);
    }
  };

  if (error) {
    return <div>Something went wrong retrieving coffee store page</div>;
  }

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.header}>
        <div className={styles.backToHomeLink}>
          <Link href="/">← Back to Home</Link>
        </div>
        <div className={styles.nameWrapper}>
          <h1 className={styles.name}>{name}</h1>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.col1}>
          <Image
            className={styles.storeImg}
            alt={name || "defaultImg"}
            src={imgUrl || defaultImgUrl}
            width={600}
            height={360}
          />
        </div>
        <div className={cls("glass", styles.col2)}>
          {address && (
            <div className={styles.iconWrapper}>
              <Image
                alt="places"
                src="/static/icons/places.svg"
                width={24}
                height={24}
              />
              <p className={styles.text}>{address}</p>
            </div>
          )}
          {distance && (
            <div className={styles.iconWrapper}>
              <Image
                alt="nearMe"
                src="/static/icons/nearMe.svg"
                width={24}
                height={24}
              />
              <p className={styles.text}>{distance} meters</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image
              alt="star"
              src="/static/icons/star.svg"
              width={24}
              height={24}
            />
            <p className={styles.text}>{votingCount}</p>
          </div>
          <button className={styles.upVoteButton} onClick={handleUpVoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
