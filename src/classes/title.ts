export default class Title {
  private titleSection: HTMLElement;
  private scrollArrow: HTMLElement;

  constructor() {
    this.titleSection = document.querySelector(".title-section")!;
    this.scrollArrow = document.querySelector(".scroll-arrow")!;

    window.addEventListener("scroll", () => this.handleScroll(), {
      once: true,
    });
  }

  handleScroll() {
    if (document.body.classList.contains("loaded")) {
      this.titleSection.removeChild(this.scrollArrow);
    }
  }
}
