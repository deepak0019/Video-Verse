// require("dotenv").config({ path: "./env" });
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    const port = process.env.PORT || 8000;

    app.on("error", (error) => {
      console.log("ERR: ", error);
      throw error;
    });

    app.listen(port, () => {
      console.log(`Server is running at PORT: ${port}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!!", err);
  });
