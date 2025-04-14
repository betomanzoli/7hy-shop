
import * as React from "react";
import { UseEmblaCarouselType } from "embla-carousel-react";
import { cn } from "@/lib/utils";
import { CarouselContext } from "./carousel-context";
import { CarouselApi } from "./types";

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    opts?: any;
    plugins?: any[];
    orientation?: "horizontal" | "vertical";
    setApi?: (api: CarouselApi) => void;
  }
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    // Import dynamically to avoid build errors
    const [emblaCarousel, setEmblaCarousel] = React.useState<typeof UseEmblaCarouselType | null>(null);
    const [carouselRef, api] = React.useMemo(() => {
      if (!emblaCarousel) return [null, null];
      return emblaCarousel({
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      }, plugins);
    }, [emblaCarousel, opts, orientation, plugins]);
    
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    // Load the carousel module dynamically
    React.useEffect(() => {
      import('embla-carousel-react').then((module) => {
        setEmblaCarousel(() => module.useEmblaCarousel);
      });
    }, []);

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return;
      }

      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, []);

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext]
    );

    React.useEffect(() => {
      if (!api || !setApi) {
        return;
      }

      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) {
        return;
      }

      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);

      return () => {
        api.off("select", onSelect);
      };
    }, [api, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);

Carousel.displayName = "Carousel";

export { Carousel };
