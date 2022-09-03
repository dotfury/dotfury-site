import GSAP from "gsap";

import medias from "../../data/medias.json";

export default class Preloader {
  private body: HTMLElement;
  private element: HTMLElement;
  private percentCount: HTMLElement;
  private medias: string[];
  private loadedMediaCount: number;
  private mediaCount: number;
  private animateOut: GSAPTimeline;
  private callback: () => void;

  constructor(callback: () => void) {
    this.body = document.body;
    this.element = document.querySelector(".preloader")!;
    this.percentCount = document.querySelector(".percent-count")!;
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
    this.animateOut.to(this.element, {
      autoAlpha: 0,
      delay: 0.5,
      duration: 1,
      ease: "power1",
    });

    this.animateOut.call(() => {
      this.body.classList.remove("loading");
      this.body.classList.add("loaded");
      this.body.removeChild(this.element);
      this.callback();
    });
  }
}
