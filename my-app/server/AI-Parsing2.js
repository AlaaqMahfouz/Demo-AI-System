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
exports.Parse = void 0;
var generative_ai_1 = require("@google/generative-ai");
/*
this code takes the cv parsed content as a string and parse it into a given JSON format
the returned JSON object should be send to Supabase through sendToSupabase.ts
*/
var textToParse = "\nCurriculum Vitae\nGebran Elias Nemes\nPersonal Information\n\u2022 Full Name: Gebran Elias Nemes \u2022 Phone Number: +9617777777 \u2022 E-mail: gebrannemes2003@gmail.com \u2022 Birthdate: 4 sept 2003 \u2022 Adress: Beirut,Lebanon\nAcademics\n\u2022 School: Coll\u00E8ge St. Elie Btina, Beirut, Lebanon (2006-2021)\n\u2022 University: 3rd year Bachelor in Computer Science, Lebanese University, Faculty of Science II, Fanar, Lebanon (2021 - Present)\n\u2022 Relevant Coursework: React, HTML/CSS/JavaScript, SQL.\n\u2022 Other Coursework: C, C++, Java, Assembly, Prolog, Networking, MATLAB, Android.\n\u2022 Platforms: VScode, Eclipse, Android Studio, VS2022, Oracle, ide68000, MATLAB, Packet Tracer, Visual Paradigm, \nGitHub.\nExperience & Certifications\n\u2022 Developed a front-end website project during the second year of university, utilizing HTML, CSS, and JavaScript. \n(https://github.com/GN1370/Better-Mental-State.git)\n\u2022 Developed a React-based online marketplace project during the current third year of university, utilizing React (libraries axios,\nreact router dom, express, cors), JavaScript, HTML, CSS, Tailwind CSS, Flowbite-React, MySQL.\n\u2022 Developed a project during the current third year of university, utilizing Android (Asynctask), PhpMyAdmin.\n\u2022 Obtained the Lebanese Civil Defence Certificate. (2023)\n\u2022 Attended the IEEE Clustering Techniques Certificate program. (January 2022)\n\u2022 Provided private tutoring in all subjects for school students in Arabic, French and English (2014 - Present).\nPersonal Traits\n\u2022 Problem Solving\n\u2022 Attention to Detail\n\u2022 Responsibility\n\u2022 Team Spirit\n\u2022 Sportsmanship\n\u2022 Leadership Skills\n\u2022 Helping Others\nSkills and Hobbies\n\u2022 Scout. (2009 - Present)\n\u2022 Film-Making/Acting.\n\u2022 Photography.\n\u2022 Arts & Crafts.\n\u2022 Drawing/Painting.\n\u2022 Cooking/Baking.\n\u2022 Swimming/Shallow Diving\nLanguages\n\u2022 Arabic (Native, Fluent) \u2022 French (Fluent) \u2022 English (Fluent)\n";
function Parse(textToParse) {
    return __awaiter(this, void 0, void 0, function () {
        var jsonTemplate, genAI, generationConfig, model, prompt_1, result, response, parsedJSON, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    jsonTemplate = "\n{\n    \"name\": \"\",\n    \"phoneNumbers\": [\"\"],\n    \"websites\": [\"\"],\n    \"emails\": [\"\"],\n    \"dateOfBirth\": \"\",\n    \"addresses\": [\n      {\n        \"street\": \"\",\n        \"city\": \"\",\n        \"state\": \"\",\n        \"zip\": \"\",\n        \"country\": \"\"\n      }\n    ],\n    \"summary\": \"\",\n    \"education\": [\n      {\n        \"school\": \"\",\n        \"degree\": \"\",\n        \"fieldOfStudy\": \"\",\n        \"startDate\": \"\",\n        \"endDate\": \"\"\n      }\n    ],\n    \"workExperience\": [\n      {\n        \"company\": \"\",\n        \"position\": \"\",\n        \"startDate\": \"\",\n        \"endDate\": \"\"\n      }\n    ],\n    \"projects\": [\n      {\n        \"projectName\": \"\",\n        \"languages\": \"\",\n        \"startDate\": \"\",\n        \"endDate\": \"\"\n      }\n    ],\n    \"skills\": [\n      {\n        \"skillName\": \"\"\n      }\n    ],\n    \"certifications\": [\n      {\n        \"certificationName\": \"\"\n      }\n    ],\n    \"languages\": [\n      {\n        \"languageName\": \"\",\n        \"proficiency\": \"\"\n      }\n    ]\n}\n";
                    genAI = new generative_ai_1.GoogleGenerativeAI("AIzaSyBDojqEFTP5MbdXksNPUgh6a1vq84VDIgw");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    generationConfig = {
                        stopSequences: ["red"],
                        maxOutputTokens: 1000,
                        temperature: 0.9,
                        topP: 0.1,
                        topK: 16,
                    };
                    model = genAI.getGenerativeModel({ model: "gemini-pro", generationConfig: generationConfig });
                    prompt_1 = "This is a resume:\n".concat(textToParse, "\nPlease parse the information into a JSON format following the structure:\n").concat(jsonTemplate, " while replacing all null values with empty strings");
                    return [4 /*yield*/, model.generateContent(prompt_1)];
                case 2:
                    result = _a.sent();
                    return [4 /*yield*/, result.response];
                case 3:
                    response = _a.sent();
                    parsedJSON = response.text();
                    console.log('json parsed : ', parsedJSON);
                    return [2 /*return*/, parsedJSON];
                case 4:
                    error_1 = _a.sent();
                    console.error('Error parsing CV:', error_1);
                    return [2 /*return*/, '']; // Or you can handle the error differently as per your requirement
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.Parse = Parse;
// Parse(textToParse);
