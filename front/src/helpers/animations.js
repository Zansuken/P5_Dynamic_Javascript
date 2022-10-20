import { selectedNode } from "../constants.js";

// -- Animations -- //

// Show a loading spinner
export const startLoading = (node, isLoading) => {
  const loader = document.createElement("div");

  loader.setAttribute("id", "loader");

  loader.classList.add("loadingSpinner");

  const loaderAnimation = [
    {
      transform: "rotate(0deg)",
    },
    {
      transform: "rotate(360deg)",
    },
  ];

  const loaderTiming = {
    duration: 2000,
    iterations: Infinity,
  };

  loader.animate(loaderAnimation, loaderTiming);

  if (node && isLoading) {
    node.append(loader);
  }

  if (!isLoading) {
    node.remove(loader);
  }
};

// Remove the loading spinner
export const finishLoading = () => document.querySelector("#loader").remove();

// Animate error message
export const animateErrorMessage = (id) => {
  if (selectedNode(id)) {
    const animation = [
      {
        transform: "translateX(0px)",
      },
      {
        transform: "translateX(5px)",
      },
      {
        transform: "translateX(-5px)",
      },
      {
        transform: "translateX(4px)",
      },
      {
        transform: "translateX(-4px)",
      },
      {
        transform: "translateX(2px)",
      },
      {
        transform: "translateX(-2px)",
      },
      {
        transform: "translateX(0px)",
      },
    ];

    const timing = {
      duration: 500,
      iteration: 1,
    };

    selectedNode(id).animate(animation, timing);
  }
};

// Animate snackbar
export const animateSnackbar = (id) => {
  const animation = [];
  // Generate animation
  for (let index = 0; index < 10; index++) {
    if (index === 0 || index === 9) {
      animation.push({
        bottom: "-30px",
        opacity: 0,
      });
    } else {
      animation.push({
        bottom: "15px",
        opacity: 1,
      });
    }
  }

  const timing = {
    duration: 5000,
    iteration: 1,
  };

  // Add animation to targeted element
  selectedNode(id).animate(animation, timing);
  setTimeout(function () {
    if (selectedNode(id)) {
      selectedNode(id).remove();
    }
  }, 5000);
};
