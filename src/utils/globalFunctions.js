const bcrypt = require("bcrypt");


const hashesss = async (pass, salt) => {
    return new Promise((resolve, reject) => {
      bcrypt.hash(pass, salt, (err, hash) => {
        if (err) {
          console.error('Error generating hash:', err);
          reject(err);
        } else {
        //   console.log('Hashed Password:', hash);
          resolve(hash);
        }
      });
    });
  };

const generateHashedPassword = async (password) => {
    try {
        const hash = await hashesss(password, 10)
        return hash        
    } catch (error) {
        return null
    }
}

// const comparePassword = 
module.exports = {
    generateHashedPassword
}