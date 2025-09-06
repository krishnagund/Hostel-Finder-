import React from 'react';

const Loader = () => {
  const loaderStyles = {
    container: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    },
    loader: {
      width: '50px',
      height: '165px',
      position: 'relative'
    },
    ball: {
      position: 'absolute',
      left: '50%',
      top: '0',
      transform: 'translate(-50%, 0)',
      width: '16px',
      height: '16px',
      backgroundColor: '#3A2C99',
      borderRadius: '50%',
      animation: 'bounce 2s linear infinite'
    },
    square: {
      position: 'absolute',
      left: '0',
      right: '0',
      bottom: '0',
      margin: 'auto',
      height: '48px',
      width: '48px',
      backgroundColor: '#fff',
      borderRadius: '4px',
      animation: 'rotate 2s linear infinite'
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes bounce {
            0%, 50%, 100% {
              transform: translate(-50%, 0px);
              height: 20px;
            }
            20% {
              transform: translate(-25%, 85px);
              height: 28px;
            }
            25% {
              transform: translate(-25%, 110px);
              height: 12px;
            }
            70% {
              transform: translate(-75%, 85px);
              height: 28px;
            }
            75% {
              transform: translate(-75%, 108px);
              height: 12px;
            }
          }
          
          @keyframes rotate {
            0%, 50%, 100% { 
              transform: rotate(0deg);
            }
            25% { 
              transform: rotate(90deg);
            }
            75% { 
              transform: rotate(-90deg);
            }
          }
        `}
      </style>
      <div style={loaderStyles.container}>
        <div style={{ textAlign: 'center' }}>
          <div style={loaderStyles.loader}>
            <div style={loaderStyles.ball}></div>
            <div style={loaderStyles.square}></div>
          </div>
          <p style={{ 
            marginTop: '20px', 
            color: '#3A2C99', 
            fontSize: '16px', 
            fontWeight: '500' 
          }}>
            Loading...
          </p>
        </div>
      </div>
    </>
  );
};

export default Loader;
