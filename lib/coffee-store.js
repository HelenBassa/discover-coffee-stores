import { createApi } from "unsplash-js";

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const query = "coffee";
const latLong = "52.17680599727068%2C20.990356662013582";
const sort = "DISTANCE";
export const limit = "9";

const getUrlForCoffeeStores = (query, latLong, sort, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&sort=${sort}&limit=${limit}`;
};

const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplash.search.getPhotos({
    query: "coffee stores",
    page: 1,
    perPage: limit, //same value as number of coffee shops
    orientation: "landscape",
  });
  const unsplashResults = photos.response.results;
  // console.log({ unsplashResults });

  return unsplashResults.map((result) => result.urls["small"]);
};

export const defaultImgUrl =
  "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80";

export const fetchCoffeeStores = async (
  latLong = "52.17680599727068%2C20.990356662013582",
  limit = "9"
) => {
  const photos = await getListOfCoffeeStorePhotos();

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
    },
  };

  const response = await fetch(
    getUrlForCoffeeStores(query, latLong, sort, limit),
    options
  );
  const data = await response.json();
  return data.results.map((result, i) => {
    return {
      id: result.fsq_id,
      name: result.name,
      address: result.location.formatted_address,
      distance: result.distance,
      imgUrl: photos.length > 0 ? photos[i] : null,
    };
  });
  // .catch((err) => console.error(err));
};
