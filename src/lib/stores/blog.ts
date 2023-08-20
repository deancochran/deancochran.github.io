import { localStorageStore } from "@skeletonlabs/skeleton";
import type { Writable } from "svelte/store";

export const blogPostStore: Writable<any> = localStorageStore(
  "blogPostStore",
  undefined
);
