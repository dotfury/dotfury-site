import GSAP from "gsap";

import medias from "../../data/medias.json";

export default class Preloader {
  private body: HTMLElement;
  private element: HTMLElement;
  private medias: string[];
  private loadedMediaCount: number;
  private mediaCount: number;
  private animateOut: GSAPTimeline | null;

  constructor(element: string) {
    this.body = document.body;
    this.element = document.querySelector(element)!;
    this.medias = medias;
    this.mediaCount = this.medias.length;
    this.loadedMediaCount = 0;
    this.animateOut = null;
  }

  start() {
    this.loadMedias();
  }

  loadMedias() {
    this.medias.forEach((media) => {
      const image = new window.Image();
      image.crossOrigin = "anonymous";
      image.src = media;

      image.onload = () => {
        this.onMediaLoaded();
      };
    });
  }

  onMediaLoaded() {
    this.loadedMediaCount += 1;
    const percent = Math.round((this.loadedMediaCount / this.mediaCount) * 100);

    if (percent >= 100) {
      this.onLoadCompleted();
    }
  }

  onLoadCompleted() {
    this.animateOut = GSAP.timeline({
      delay: 1,
    });

    this.animateOut.to(this.element, {
      autoAlpha: 0,
      duration: 1,
    });

    this.animateOut.call(() => {
      this.body.classList.remove("loading");
      this.body.removeChild(this.element);
    });
  }
}
