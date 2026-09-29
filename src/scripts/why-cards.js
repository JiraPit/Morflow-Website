/** Ported verbatim from the reference static build and extended to support multiple rows. */
export function init(reduced) {
  // ============ WHY-CARDS: sticky hover (exact framer Benefit cards) ============
  // Each card opens on mouseenter and STAYS open until another card is
  // hovered in that row — no reset on pointer leave.
  const whyRows = document.querySelectorAll(".why-cards");
  whyRows.forEach((whyRow) => {
    const wcards = Array.from(whyRow.querySelectorAll(".wcard"));
    const activate = (card) => {
      if (card.classList.contains("is-active")) return;
      wcards.forEach((c) => c.classList.toggle("is-active", c === card));
    };
    wcards.forEach((card) => {
      card.addEventListener("pointerenter", () => activate(card));
      card.addEventListener("focus", () => activate(card));
    });
  });
}
