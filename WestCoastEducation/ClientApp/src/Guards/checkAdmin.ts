import { getUserStorage } from "../Providers/auth.provider";

export const checkAdmin = () => {
    const user = getUserStorage()

    console.log("checkAuth")
    return new Promise(async (resolve, reject) => {
          if(user?.role == "Admin"){
            resolve(null);
          } else {
            reject(new Error('/'));
          }
  })
};
