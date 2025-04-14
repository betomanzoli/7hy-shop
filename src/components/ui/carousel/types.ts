
import { type EmblaCarouselType, type EmblaOptionsType, type EmblaPluginType } from "embla-carousel";
import * as React from "react";
import type { UseEmblaCarouselType } from "embla-carousel-react";

export type CarouselApi = EmblaCarouselType;
export type CarouselOptions = EmblaOptionsType;
export type CarouselPlugin = EmblaPluginType;

export type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin[];
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

export type CarouselContextProps = {
  carouselRef: ReturnType<typeof UseEmblaCarouselType>[0];
  api: ReturnType<typeof UseEmblaCarouselType>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

export type CarouselNextProps = {
  orientation?: "horizontal" | "vertical";
} & React.HTMLAttributes<HTMLButtonElement>;

export type CarouselPrevProps = {
  orientation?: "horizontal" | "vertical";
} & React.HTMLAttributes<HTMLButtonElement>;
