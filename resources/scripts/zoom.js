document.addEventListener("DOMContentLoaded", function () {
  const zoomToggle = document.getElementById("zoom-toggle");
  let zoomEnabled = false;
  const zoomResult = document.createElement("div");
  zoomResult.classList.add("img-zoom-result");
  zoomResult.setAttribute("aria-hidden", "true");
  document.body.appendChild(zoomResult);

  function setZoomListeners(enabled) {
    const zoomTargets = document.querySelectorAll(
      ".img-zoom-container, .summary-page, .front-cover, .back-cover"
    );

    zoomTargets.forEach((container) => {
      let imgURL = null;

      const bg = container.style.backgroundImage;
      if (bg && bg !== "none") {
        const match = bg.match(/url\(["']?([^"')]+)["']?\)/);
        if (match && match[1]) imgURL = match[1];
      }

      if (!imgURL) {
        const innerImg = container.querySelector("img");
        if (innerImg) {
          imgURL = innerImg.src;
        }
      }

      if (!imgURL) return;

      if (enabled) {
        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mouseleave", handleMouseLeave);
        container.setAttribute("data-img", imgURL);
        container.classList.add("zoomable");
      } else {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
        container.removeAttribute("data-img");
        container.classList.remove("zoomable");
      }
    });
  }

  function handleMouseMove(e) {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const imgURL = container.getAttribute("data-img");

    if (!imgURL) return;

    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    zoomResult.style.display = "block";
    zoomResult.style.backgroundImage = `url(${imgURL})`;
    zoomResult.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
    zoomResult.style.backgroundSize = "300%";
  }

  function handleMouseLeave() {
    zoomResult.style.display = "none";
  }

  zoomToggle.addEventListener("click", () => {
    zoomEnabled = !zoomEnabled;
    document.body.classList.toggle("zoom-active", zoomEnabled);
    zoomToggle.classList.toggle("active", zoomEnabled);
    setZoomListeners(zoomEnabled);

    if (!zoomEnabled) {
      zoomResult.style.display = "none";
    }
  });
});
