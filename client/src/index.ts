function onScrollEnd(f: (e: Event) => void, timeout = 200) {
  let timeoutId: number | null = null;
  function listener(e: Event) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => f(e), timeout);
  }
  window.addEventListener("scroll", listener);

  return () => {
    window.removeEventListener("scroll", listener);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
}

let getTopHeader = () => {
  const headers = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
  let headerPositions = Array.from(headers).map((header) => ({
    element: header,
    position: header.getBoundingClientRect().top,
  }));

  // Sort headers by their position
  headerPositions.sort((a, b) => a.position - b.position);
  for (let header of headerPositions) {
    if (header.position > 0) return header.element.id;
  }
  return null;
};
function scrollToHeader(headerId: string, offset = 0) {
  // Find the header element by ID
  const headerElement = document.getElementById(headerId);

  if (headerElement) {
    // Get the header's position relative to the top of the page
    const headerPosition =
      headerElement.getBoundingClientRect().top + window.pageYOffset;

    // Calculate the final scroll position, accounting for the offset
    const scrollPosition = headerPosition - offset;

    // Scroll to the calculated position
    window.scrollTo({
      top: scrollPosition,
      behavior: "smooth",
    });

    // Optionally, set focus to the header for accessibility
    headerElement.focus({ preventScroll: true });

    return true; // Indicate success
  } else {
    console.warn(`Header with id "${headerId}" not found.`);
    return false; // Indicate failure
  }
}

export const register = () =>
  onScrollEnd(() => {
    const topHeader = getTopHeader();
    console.log(topHeader);
  });
