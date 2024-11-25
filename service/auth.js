const jwt = require("jsonwebtoken");
const secret = "Archit80!@#$%^&*()"


//const sessionIdToUserMap = new Map();

function setUser(user){
  //  return sessionIdToUserMap.set(id,user);
 
  return jwt.sign({
    _id: user._id,
    email : user.email
  }, secret)
}

function getUser(token){
  if(!token) return  null;

  try{
    return jwt.verify(token, secret);  
  } catch(error){
    return null;
    console.error(error);
  }
}

module.exports = {
    setUser,getUser,
};

