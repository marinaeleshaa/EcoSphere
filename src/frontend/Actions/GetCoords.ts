export interface ICoords {
        loginX: number;
        registerX: number;
        loginImgX: number;
        loginImgY: number;
        signupImgX: number;
        signupImgY: number;
        toSignUpX: number;
        toSignInX: number;
    }



export const getCoords = (width: number) => {
    const percentWidth = width / 5;

    // xs screen < 640px
    if (width < 640) {
      return {
        // circle (unchanged)
        loginX: -percentWidth * 2,
        registerX: 100,

        // images
        loginImgX: -450,
        loginImgY: 120,

        signupImgX: 1200,
        signupImgY: 150,

        // text panels
        toSignUpX: 0,
        toSignInX: 1500,
      };
    }

    // sm screen < 768
    if (width < 768) {
      return {
        loginX: -1350,
        registerX: 360,

        loginImgX: -350,
        loginImgY: 200,

        signupImgX: 0,
        signupImgY: 0,

        toSignUpX: 0,
        toSignInX: 0,
      };
    }

    // md screen < 1024
    if (width < 1024) {
      return {
        loginX: -1350,
        registerX: 500,

        loginImgX: -510,
        loginImgY: 200,

        signupImgX: 0,
        signupImgY: 0,

        toSignUpX: -100,
        toSignInX: 70,
      };
    }

    // lg screen < 1280
    if (width < 1280) {
      return {
        loginX: -1200,
        registerX: 600,

        loginImgX: -600,
        loginImgY: 200,

        signupImgX: -70,
        signupImgY: 200,

        toSignUpX: 0,
        toSignInX: 0,
      };
    }

    // xl screen
    if (width < 1535) {
      return {
        loginX: -1100,
        registerX: 600,

        loginImgX: -750,
        loginImgY: 200,

        signupImgX: -190,
        signupImgY: 200,

        toSignUpX: 0,
        toSignInX: 0,
      };
    }

    // 2xl+
    return {
      loginX: -1000,
      registerX: 800,

      loginImgX: -1000,
      loginImgY: 200,

      signupImgX: -190,
      signupImgY: 200,

      toSignUpX: 0,
      toSignInX: 0,
    };
  };