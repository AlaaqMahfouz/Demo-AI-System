"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var supabase_js_1 = require("@supabase/supabase-js");
// Initialize Supabase client
var client = (0, supabase_js_1.createClient)("https://oquytlezdjnnavnjwsue.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xdXl0bGV6ZGpubmF2bmp3c3VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTExODQ2NTYsImV4cCI6MjAyNjc2MDY1Nn0.2_PfE7QWBKQmPmUKHaTGX_DtUNDTmXnkW8rkMsEfzcw");
//resume content parsed into a json template through AI-Parsing2.ts
var resumeData = {
    "name": "Gebran Elias Nemes",
    "phoneNumbers": ["+9617777777"],
    "websites": [],
    "emails": ["gebrannemes2003@gmail.com"],
    "dateOfBirth": "4 sept 2003",
    "addresses": [
        {
            "street": "",
            "city": "Beirut",
            "state": "",
            "zip": "",
            "country": "Lebanon"
        }
    ],
    "summary": "",
    "education": [
        {
            "school": "Collège St. Elie Btina",
            "degree": "",
            "fieldOfStudy": "",
            "startDate": "2006",
            "endDate": "2021"
        },
        {
            "school": "Lebanese University, Faculty of Science II",
            "degree": "Bachelor in Computer Science",
            "fieldOfStudy": "",
            "startDate": "2021",
            "endDate": ""
        }
    ],
    "workExperience": [],
    "projects": [
        {
            "projectName": "Front-end website project",
            "languages": "HTML, CSS, JavaScript",
            "startDate": "",
            "endDate": ""
        },
        {
            "projectName": "React-based online marketplace project",
            "languages": "React, JavaScript, HTML, CSS, Tailwind CSS, Flowbite-React, MySQL",
            "startDate": "",
            "endDate": ""
        },
        {
            "projectName": "Android project",
            "languages": "Android, PhpMyAdmin",
            "startDate": "",
            "endDate": ""
        }
    ],
    "skills": [
        {
            "skillName": "Problem Solving"
        },
        {
            "skillName": "Attention to Detail"
        },
        {
            "skillName": "Responsibility"
        },
        {
            "skillName": "Team Spirit"
        },
        {
            "skillName": "Sportsmanship"
        },
        {
            "skillName": "Leadership Skills"
        },
        {
            "skillName": "Helping Others"
        }
    ],
    "certifications": [
        {
            "certificationName": "Lebanese Civil Defence Certificate"
        },
        {
            "certificationName": "IEEE Clustering Techniques Certificate"
        }
    ],
    "languages": [
        {
            "languageName": "Arabic",
            "proficiency": "Native, Fluent"
        },
        {
            "languageName": "French",
            "proficiency": "Fluent"
        },
        {
            "languageName": "English",
            "proficiency": "Fluent"
        }
    ]
};
//splitting the json 
function splitJSON(parsedJSON) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.from('documents').insert(parsedJSON)];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        console.error('Error inserting data:', error.message);
                    }
                    else {
                        console.log('Data inserted successfully:', data);
                    }
                    console.log("Successfully send to DB");
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _b.sent();
                    console.error('Error sending to the DB:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
splitJSON(resumeData); //call function
