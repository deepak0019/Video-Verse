import { Router } from "express";
// import {
//   toggleSubscription,
//   getUserChannelSubscribers,
//   getSubscribedChannels,
// } from "../controllers/subsciption.controller.js";

import {
  toggleSubscription,
  getUserSubscribedChannels,
  getSubscribedChannelsByOwner,
} from "../controllers/subsciption.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
  .route("/c/:channelId")
  .get(getUserSubscribedChannels)
  .post(toggleSubscription);

router.route("/u/:subscriberId").get(getSubscribedChannelsByOwner);
export default router;
