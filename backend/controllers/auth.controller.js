export const signup = async (req, res) => {
  try {
    res.send("Hey from signup Page");
  } catch (error) {
    console.log(`Error in signup Controller: ${error.message}`);
  }
};

export const login = async (req, res) => {
  try {
    res.send("Hey from login Page");
  } catch (error) {
    console.log(`Error in login Controller: ${error.message}`);
  }
};

export const logout = async (req, res) => {
  try {
    res.send("Hey from logout Page");
  } catch (error) {
    console.log(`Error in logout Controller: ${error.message}`);
  }
};
