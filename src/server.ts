import app from "./app";
import { initDB } from "./db";
import config from "./config";



const port = config.port

const main = () => {
  initDB();

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};
main()