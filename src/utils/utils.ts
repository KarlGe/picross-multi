import { makeSeed } from "@services/rand";

const queryKeys = {
  seed: "s",
};

export function setQuerySeed(newSeed: number) {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set(queryKeys.seed, newSeed.toString());
  window.history.pushState({}, "", `/?${searchParams}`);
}

export function getQuerySeed() {
  const searchParams = new URLSearchParams(window.location.search);
  const querySeed = parseInt(searchParams.get(queryKeys.seed));
  if (isNaN(querySeed)) {
    const newSeed = makeSeed();
    setQuerySeed(newSeed);
    return newSeed;
  }
  return querySeed;
}
