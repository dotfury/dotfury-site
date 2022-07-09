import SplitType from "split-type";
import GSAP from "gsap";

export default class Introduction {
  private introductionContainer: HTMLElement;
  private lines: HTMLDivElement[];
  private observer: IntersectionObserver;

  constructor() {
    this.introductionContainer = document.querySelector(".introduction")!;
    this.lines = new SplitType(".introduction p").lines as HTMLDivElement[];
    GSAP.set(this.lines, { opacity: 0 });

    const observerOptions = {
      rootMargin: "0px",
      threshold: 1.0,
    };
    this.observer = new window.IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.handleIntersection();
        }
      });
    }, observerOptions);

    this.observer.observe(this.introductionContainer);
  }

  handleIntersection() {
    this.observer.unobserve(this.introductionContainer);
    GSAP.fromTo(
      this.lines,
      { translateY: "150%" },
      {
        opacity: 1,
        stagger: 0.1,
        duration: 1,
        translateY: "0",
        ease: "power1.out",
      }
    );
  }
}
