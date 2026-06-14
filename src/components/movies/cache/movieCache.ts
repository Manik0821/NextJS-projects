import { MovieOption } from "../../../lib/types/movie";

export const searchCache: Record<
  string,
  MovieOption[]
> = {};

export const detailsCache: Record<
  string,
  any
> = {};