"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g = Object.create(
        (typeof Iterator === "function" ? Iterator : Object).prototype,
      );
    return (
      (g.next = verb(0)),
      (g["throw"] = verb(1)),
      (g["return"] = verb(2)),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                    ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
// Replace require for models with dynamic import
let TextBlock, Image;
(async () => {
  TextBlock = (await import("../models/TextBlock.js")).default;
  Image = (await import("../models/Image.js")).default;
  // Update with your actual username and password
  var MONGO_URI =
    "mongodb+srv://myuser:Anshum@255@tpc.z8zgugo.mongodb.net/tpcDB?retryWrites=true&w=majority&appName=TPC";
  var textBlocks = [
    { title: "Site Title", value: "Turning Point Community" },
    { title: "Site Tagline", value: "India's Largest Student-Run Society" },
    { title: "Homepage Heading", value: "Welcome to Turning Point Community" },
    {
      title: "Homepage Subheading",
      value:
        "Empowering over 10,000 students across India through intellectually enriching platforms that foster leadership, critical thinking, and civic engagement.",
    },
    { title: "About Section Title", value: "Shaping Tomorrow's Leaders" },
    { title: "About Section Badge", value: "About TPC" },
    { title: "Explore Section Title", value: "Explore TPC" },
    {
      title: "Explore Section Subheading",
      value: "Discover different aspects of our vibrant Community",
    },
    { title: "Quick Link 1", value: "Our Events" },
    { title: "Quick Link 2", value: "Meet Our Team" },
    { title: "Quick Link 3", value: "Join TPC" },
    { title: "Quick Link 4", value: "Gallery" },
    { title: "Quick Link 4 Desc", value: "Moments from our events" },
    { title: "Events Section Title", value: "Events we have done" },
    {
      title: "Events Section Subheading",
      value: "Be part of India's most prestigious academic competitions",
    },
    { title: "Leaders Section Title", value: "Meet Our Leaders" },
    {
      title: "Leaders Section Subheading",
      value: "The passionate individuals driving TPC's mission forward",
    },
    { title: "Connect Section Title", value: "Connect With Us" },
    {
      title: "Connect Section Subheading",
      value:
        "Stay updated with our latest events, achievements, and Community highlights across all social platforms",
    },
    { title: "What We Do Title", value: "What We Do" },
    { title: "What We Do 1", value: "Debate Competitions" },
    { title: "What We Do 2", value: "MUNited Nations" },
    { title: "What We Do 3", value: "Leadership Workshops" },
    { title: "What We Do 4", value: "Social Impact Initiatives" },
    { title: "Contact Section Title", value: "Contact Us" },
    {
      title: "Contact Section Subheading",
      value:
        "Ready to join India's most dynamic student Community? We're here to help and answer any questions you might have.",
    },
    { title: "Contact Form Title", value: "Send us a Message" },
    {
      title: "Contact Form Subheading",
      value:
        "Have questions about our events, want to join our team, or need more information? Fill out the form below and we'll get back to you soon.",
    },
    { title: "Contact Form Name", value: "Full Name" },
    { title: "Contact Form Email", value: "Email Address" },
    { title: "Contact Form Phone", value: "Phone Number" },
    { title: "Contact Form Subject", value: "Subject" },
    { title: "Contact Form Message", value: "Message" },
    { title: "Contact Form Button", value: "Send Message" },
    { title: "Team Section Title", value: "Our Team" },
    {
      title: "Team Section Subheading",
      value:
        "Meet the passionate individuals and distinguished advisors who drive TPC's mission to empower India's youth",
    },
    { title: "Core Team Title", value: "Core Team" },
    {
      title: "Core Team Subheading",
      value: "The dedicated leaders who make TPC's vision a reality",
    },
    { title: "Advisors Section Title", value: "Board of Advisors" },
    {
      title: "Advisors Section Subheading",
      value:
        "Distinguished professionals and thought leaders who guide our mission and provide invaluable expertise",
    },
    { title: "Connect With Team Title", value: "Connect With Our Team" },
    {
      title: "Connect With Team Subheading",
      value:
        "Ready to join our mission? Reach out to our team members directly or send us a message.",
    },
    { title: "Join Team Button", value: "Join Our Team" },
    { title: "Contact Team Button", value: "Contact Us" },
    { title: "Homepage Stat 1 Number", value: "10K+" },
    { title: "Homepage Stat 1 Label", value: "Students" },
    { title: "Homepage Stat 2 Number", value: "50+" },
    { title: "Homepage Stat 2 Label", value: "Events" },
    { title: "Homepage Stat 3 Number", value: "14+" },
    { title: "Homepage Stat 3 Label", value: "Distinguished Advisors" },
    { title: "Homepage Stat 4 Number", value: "6+" },
    { title: "Homepage Stat 4 Label", value: "Partner Institutions" },
    { title: "Achievement 1 Title", value: "India's Largest" },
    { title: "Achievement 1 Subtitle", value: "Student-Run Society" },
    { title: "Achievement 2 Title", value: "10+ Years" },
    { title: "Achievement 2 Subtitle", value: "of Excellence" },
    { title: "Achievement 3 Title", value: "Recognized by" },
    { title: "Achievement 3 Subtitle", value: "Top Institutions" },
    { title: "Footer Stat 1 Number", value: "10,000+" },
    { title: "Footer Stat 1 Label", value: "Active Students" },
    { title: "Footer Stat 2 Number", value: "50+" },
    { title: "Footer Stat 2 Label", value: "Annual Events" },
    { title: "Footer Stat 3 Number", value: "14+" },
    { title: "Footer Stat 3 Label", value: "Distinguished Advisors" },
    { title: "Footer Stat 4 Number", value: "6+" },
    { title: "Footer Stat 4 Label", value: "Partner Institutions" },
  ];
  var images = [
    {
      title: "Site Logo",
      url: "/images/logo.png",
      alt: "Turning Point Community Logo",
    },
    {
      title: "Hero Image",
      url: "/images/hero.jpg",
      alt: "Turning Point Community Hero",
    },
    {
      title: "Gallery Image",
      url: "/images/gallery.jpg",
      alt: "Turning Point Community Gallery",
    },
    {
      title: "Team Image",
      url: "/images/team.jpg",
      alt: "Turning Point Community Team",
    },
    // Add more images as needed...
  ];
  function seed() {
    return __awaiter(this, void 0, void 0, function () {
      var _i, textBlocks_1, block, _a, images_1, img;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            return [4 /*yield*/, mongoose_1.default.connect(MONGO_URI)];
          case 1:
            _b.sent();
            console.log("Connected to MongoDB");
            ((_i = 0), (textBlocks_1 = textBlocks));
            _b.label = 2;
          case 2:
            if (!(_i < textBlocks_1.length)) return [3 /*break*/, 5];
            block = textBlocks_1[_i];
            return [
              4 /*yield*/,
              TextBlock.findOneAndUpdate(
                { title: block.title },
                { value: block.value },
                { upsert: true, new: true },
              ),
            ];
          case 3:
            _b.sent();
            console.log("Upserted text block: ".concat(block.title));
            _b.label = 4;
          case 4:
            _i++;
            return [3 /*break*/, 2];
          case 5:
            ((_a = 0), (images_1 = images));
            _b.label = 6;
          case 6:
            if (!(_a < images_1.length)) return [3 /*break*/, 9];
            img = images_1[_a];
            return [
              4 /*yield*/,
              Image.findOneAndUpdate(
                { title: img.title },
                { url: img.url, alt: img.alt },
                { upsert: true, new: true },
              ),
            ];
          case 7:
            _b.sent();
            console.log("Upserted image: ".concat(img.title));
            _b.label = 8;
          case 8:
            _a++;
            return [3 /*break*/, 6];
          case 9:
            return [4 /*yield*/, mongoose_1.default.disconnect()];
          case 10:
            _b.sent();
            console.log("Done!");
            return [2 /*return*/];
        }
      });
    });
  }
  seed().catch(function (err) {
    console.error(err);
    process.exit(1);
  });
})();
