import jwt from "jsonwebtoken";
import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import { globalHandlingError } from "./src/middlewares/asyncHandler.js";
import { authRouter } from "./src/modules/auth/auth.routes.js";
import { User } from "./database/models/user.model.js";
import { AppError } from "./src/utilties/appError.js";
import { messages } from "./src/utilties/commons/messages.js";
import { userRouter } from "./src/modules/user/user.routes.js";
import { companyRouter } from "./src/modules/company/company.routes.js";
import { jobRouter } from "./src/modules/job/job.routes.js";

const app = express();
const port = 3000;
dbConnection();

app.use(express.json());
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/company", companyRouter);
app.use("/job", jobRouter);

app.get("/verify/:token", async (req, res, next) => {
  jwt.verify(req.params.token, "thisIsMySecterKey", async (err, decoded) => {
    if (err) next(new AppError(messages.token.invalidToken, 400));
    await User.findOneAndUpdate(
      { email: decoded.email },
      { comfirmedEmail: true }
    );
    res.json({ message: messages.user.verifiedAccount, email: decoded.email });
  });
});

app.use(globalHandlingError);
app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
