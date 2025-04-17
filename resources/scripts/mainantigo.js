window.addEventListener("load", () => {
  document.getElementById("book-container").style.visibility = "visible";
});

document.addEventListener("DOMContentLoaded", function () {
  const itemsLinks = document.querySelectorAll("#items a");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const searchInput = document.getElementById("search-input");
  const searchBtn = document.getElementById("search-btn");
  const flipbook = $("#flipbook");

  let currentPage = 0;
  const totalPages = document.querySelectorAll(
    '#flipbook .turn-page:not([aria-hidden="true"])'
  ).length;

  function showPage(pageNumber) {
    const maxPage = totalPages - 1;
    pageNumber = Math.max(0, Math.min(pageNumber, maxPage));
    flipbook.turn("page", pageNumber + 1);
    currentPage = pageNumber;
    updateActiveLink();
  }

  function updateActiveLink() {
    itemsLinks.forEach((link) => {
      link.classList.remove("active");
      if (
        link.getAttribute("href") === "./resources/images/front-cover.png" &&
        currentPage === 0
      ) {
        link.classList.add("active");
      } else if (
        link.getAttribute("href") === "./resources/images/back-cover.png" &&
        currentPage === totalPages + 1
      ) {
        link.classList.add("active");
      } else if (
        link.dataset.page &&
        parseInt(link.dataset.page) === currentPage
      ) {
        link.classList.add("active");
      }
    });
  }

  function nextPage() {
    flipbook.turn("next");
  }

  function prevPage() {
    flipbook.turn("previous");
  }

  function init() {
    // Initialize turn.js sem criar páginas dinamicamente
    flipbook.turn({
      display: "single",
      acceleration: true,
      gradients: !$.isTouch,
      elevation: 50,
      duration: 1000,
      width: 600,
      height: 840,
      pages: totalPages,
      when: {
        turning: function (e, page) {
          currentPage =
            page === 1
              ? 0
              : page === totalPages + 1
              ? totalPages + 1
              : page - 1;
          updateActiveLink();
        },
      },
    });

    function adjustBookSize() {
      const book = document.getElementById("book");
      const maxWidth = window.innerWidth * 0.7;
      const maxHeight = window.innerHeight * 0.8;
      const aspectRatio = 5 / 7;

      let width = Math.min(600, maxWidth);
      let height = width / aspectRatio;

      if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
      }

      flipbook.turn("size", width, height);
      book.style.width = `${width}px`;
      book.style.height = `${height}px`;
    }

    window.addEventListener("load", adjustBookSize);
    window.addEventListener("resize", adjustBookSize);

    showPage(0);

    itemsLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        if (this.dataset.page) {
          const pageNum = parseInt(this.dataset.page);
          if (!isNaN(pageNum)) {
            if (pageNum === -1) {
              showPage(totalPages - 1); // contra-capa
            } else if (pageNum >= 0 && pageNum < totalPages) {
              showPage(pageNum);
            } else {
              alert("Página ainda não disponível.");
            }
          }
        }
      });
    });

    document.addEventListener("click", function (e) {
      if (e.target.classList.contains("summary-link")) {
        e.preventDefault();
        const pageNum = parseInt(e.target.dataset.page);
        if (!isNaN(pageNum)) {
          showPage(pageNum);
        }
      }
    });

    prevBtn.addEventListener("click", prevPage);
    nextBtn.addEventListener("click", nextPage);

    searchBtn.addEventListener("click", function () {
      const pageNum = parseInt(searchInput.value);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        showPage(pageNum);
      }
    });

    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        const pageNum = parseInt(searchInput.value);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
          showPage(pageNum);
        }
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") {
        nextPage();
      } else if (e.key === "ArrowLeft") {
        prevPage();
      }
    });
  }

  const menuToggle = document.getElementById("menu-toggle");
  const sidebar = document.getElementById("sidebar");

  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });

  itemsLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.remove("active");
      }
    });
  });

  init();
});
