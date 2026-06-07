import express from "express";

import { body } from "express-validator";

import jwt from "jsonwebtoken";

import User from "../models/User.js";

import Flashcard from "../models/Flashcard.js";

import Quiz from "../models/Quiz.js";

import Document from "../models/Document.js";

import Activity from "../models/Activity.js";

import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
} from "../controllers/authController.js";

import protect from "../middleware/auth.js";

const router = express.Router();

// ======================================================
// VALIDATION MIDDLEWARE
// ======================================================

const registerValidation = [

  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage(
      "Username must be at least 3 characters"
    ),

  body("email")
    .isEmail()
    .withMessage(
      "Please enter a valid email"
    ),

  body("password")
    .isLength({ min: 6 })
    .withMessage(
      "Password must be at least 6 characters"
    ),
];

const loginValidation = [

  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage(
      "Please provide a valid email"
    ),

  body("password")
    .notEmpty()
    .withMessage(
      "Password is required"
    ),
];

// ======================================================
// REGISTER
// ======================================================

router.post(
  "/register",
  registerValidation,
  register
);

// ======================================================
// LOGIN
// ======================================================

router.post(
  "/login",
  loginValidation,
  login
);

// ======================================================
// GET PROFILE
// ======================================================

router.get(
  "/profile",
  protect,
  getProfile
);

// ======================================================
// UPDATE PROFILE
// ======================================================

router.put(
  "/profile",
  protect,
  updateProfile
);

// ======================================================
// CHANGE PASSWORD
// ======================================================

router.post(
  "/change-password",
  protect,
  changePassword
);

// ======================================================
// GET CURRENT LOGGED IN USER
// ======================================================

router.get(
  "/me",

  async (req, res) => {

    try {

      // ======================================================
      // GET TOKEN
      // ======================================================

      const token =
        req.headers.authorization?.split(
          " "
        )[1];

      if (!token) {

        return res.status(401).json({

          success: false,

          message:
            "No token provided",
        });
      }

      // ======================================================
      // VERIFY TOKEN
      // ======================================================

      const decoded =
        jwt.verify(
          token,
          process.env.JWT_SECRET
        );

      // ======================================================
      // GET USER
      // ======================================================

      const user =
        await User.findById(
          decoded.id
        ).select("-password");

      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",
        });
      }

      // ======================================================
      // TOTAL DOCUMENTS
      // ======================================================

      const documentsCount =
        await Document.countDocuments({

          userId: user._id,
        });

      // ======================================================
      // FLASHCARD SETS COUNT
      // ======================================================

      const flashcardsCount =
        await Flashcard.countDocuments({

          userId: user._id,
        });

      // ======================================================
      // QUIZ SETS COUNT
      // ======================================================

      const quizCount =
        await Quiz.countDocuments({

          userId: user._id,
        });

      // ======================================================
      // RESPONSE
      // ======================================================

      res.status(200).json({

        success: true,

        user: {

          ...user._doc,

          documentsCount,

          flashcardsCount,

          quizCount,
        },
      });

    } catch (error) {

      console.log(
        "PROFILE FETCH ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to fetch profile",
      });
    }
  }
);

// ======================================================
// GET RECENT ACTIVITIES
// ======================================================

router.get(
  "/activities",
  protect,

  async (req, res) => {

    try {

      const activities =
        await Activity.find({

          userId:
            req.user._id,

        })
          .sort({
            createdAt: -1,
          })
          .limit(10);

      res.status(200).json({

        success: true,

        data: activities,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          "Failed to fetch activities",
      });
    }
  }
);

export default router;