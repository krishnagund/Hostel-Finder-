import React from "react";

const Loader = () => {
  const loaderStyles = {
    container: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
    },
    loader: {
      color: "#3A2C99",
      width: "12px", // bigger than 4px
      aspectRatio: "1 / 1",
      borderRadius: "50%",
      boxShadow: "50px 0 0 14px, 100px 0 0 6px, 150px 0 0 0",
      transform: "translateX(-100px)",
      animation: "l21 0.6s infinite alternate linear",
    },
  };

  return (
    <>
      <style>
        {`
          @keyframes l21 {
            50%  { box-shadow: 50px 0 0 6px, 100px 0 0 14px, 150px 0 0 6px }
            100% { box-shadow: 50px 0 0 0   , 100px 0 0 6px , 150px 0 0 14px }
          }

          /* Responsive scaling */
          @media (max-width: 768px) {
            .loader-ball {
              width: 8px !important;
              box-shadow: 30px 0 0 10px, 60px 0 0 4px, 90px 0 0 0 !important;
              transform: translateX(-60px) !important;
            }
          }

          @media (max-width: 480px) {
            .loader-ball {
              width: 6px !important;
              box-shadow: 20px 0 0 8px, 40px 0 0 3px, 60px 0 0 0 !important;
              transform: translateX(-40px) !important;
            }
          }
        `}
      </style>

      <div style={loaderStyles.container}>
        <div className="loader-ball" style={loaderStyles.loader}></div>
      </div>
    </>
  );
};

export default Loader;
