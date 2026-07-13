import { useEffect } from "react";
import { useScroll } from "@react-three/drei";

// Mapa das âncoras "lógicas" para o índice de página do ScrollControls.
// Precisa ficar em sincronia com a ordem das <section> dentro do <Scroll html>.
const PAGE_INDEX: Record<string, number> = {
  hero: 0,
  about: 1,
  toolkit: 2,
  projects: 3,
  contact: 4,
};

export function ScrollNav() {
  const scroll = useScroll();

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = (event.target as HTMLElement)?.closest<HTMLElement>(
        "[data-scroll-to]"
      );
      if (!target) return;

      const key = target.dataset.scrollTo;
      if (!key || !(key in PAGE_INDEX)) return;

      event.preventDefault();
      scroll.el.scrollTo({
        top: PAGE_INDEX[key] * scroll.el.clientHeight,
        behavior: "smooth",
      });
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [scroll]);

  return null;
}
