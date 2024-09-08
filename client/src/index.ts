let getTopHeader = () => {
  const headers = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
  let headerPositions = Array.from(headers).map((header) => ({
    element: header,
    position: header.getBoundingClientRect().top,
  }));

  // Sort headers by their position
  headerPositions.sort((a, b) => Math.abs(a.position) - Math.abs(b.position));

  return headerPositions[0];
};

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

function scrollToHeader(headerId: string, offset = 0) {
  // Find the header element by ID
  const headerElement = document.getElementById(headerId);

  if (headerElement) {
    // Get the header's position relative to the top of the page
    const headerPosition =
      headerElement.getBoundingClientRect().top + window.scrollY;

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

export const register = () => {
  const socket = new WebSocket("ws://localhost:8080/?room=abc123");

  let lastScroll: string | null = null;

  socket.addEventListener("message", (event) => {
    if (lastScroll != event.data) scrollToHeader(event.data);
  });

  onScrollEnd(() => {
    const topHeader = getTopHeader();
    lastScroll = topHeader.element.id;
    socket.send(topHeader.element.id);
  });

  socket.addEventListener("open", (event) => {
    console.log("WebSocket connection opened");
  });
  socket.addEventListener("close", (event) => {
    console.log("WebSocket connection closed");
  });

  socket.addEventListener("error", (event) => {
    console.error("WebSocket error:", event);
  });
};
