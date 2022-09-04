import GSAP from "gsap";

import medias from "../../data/medias.json";

export default class Preloader {
  body: HTMLElement;
  element: HTMLElement;
  cube: HTMLElement;
  percentCount: HTMLElement;
  medias: string[];
  loadedMediaCount: number;
  mediaCount: number;
  animateOut: GSAPTimeline;
  callback: () => void;

  constructor(callback: () => void) {
    this.body = document.body;
    this.element = document.querySelector(".preloader")!;
    this.percentCount = document.querySelector(".percent-count")!;
    this.cube = document.querySelector(".cube-container")!;
    this.medias = medias;
    this.mediaCount = this.medias.length;
    this.loadedMediaCount = 0;
    this.animateOut = GSAP.timeline();
    this.callback = callback;
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
    this.percentCount.innerHTML = `${percent}%`;

    if (percent >= 100) {
      this.onLoadCompleted();
    }
  }

  onLoadCompleted() {
    this.animateOut
      .to(this.cube, {
        delay: 0.2,
        duration: 0.2,
        ease: "power1",
        transform: "scale(1.5)",
      })
      .to(this.cube, {
        duration: 0.4,
        ease: "power1.out",
        transform: "scale(0)",
      });

    this.animateOut.call(() => {
      this.body.classList.remove("loading");
      this.body.classList.add("loaded");
      this.body.removeChild(this.element);
      this.callback();
    });
  }
}
