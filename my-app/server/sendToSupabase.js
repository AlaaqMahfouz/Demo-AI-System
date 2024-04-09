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
exports.sendToSupabase = void 0;
var supabase_js_1 = require("@supabase/supabase-js");
// Initialize Supabase client
var client = (0, supabase_js_1.createClient)("https://oquytlezdjnnavnjwsue.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xdXl0bGV6ZGpubmF2bmp3c3VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTExODQ2NTYsImV4cCI6MjAyNjc2MDY1Nn0.2_PfE7QWBKQmPmUKHaTGX_DtUNDTmXnkW8rkMsEfzcw");
//resume content parsed into a json template through AI-Parsing2.ts
var resumeData = "{\n  \"name\": \"Jane Joseph Beyrouthy\",\n  \"phoneNumbers\": [\n    {\n      \"phoneNumber\": \"+96176460295\"\n    }\n  ],\n  \"websites\": [],\n  \"emails\": [\n    {\n      \"email\": \"janebeyrouthy@gmail.com\"\n    }\n  ],\n  \"dateOfBirth\": \"\",\n  \"addresses\": [\n    {\n      \"street\": \"\",\n      \"city\": \"Lebanon\",\n      \"state\": \"\",\n      \"zip\": \"\",\n      \"country\": \"\"\n    }\n  ],\n  \"summary\": \"My main objective is to secure an internship where I can learn and grow my skills enabling me to kickstart my career in data science.\",\n  \"education\": [\n    {\n      \"school\": \"Lebanese University Faculty of Sciences Second Branch (ULFS2) \u2013 Fanar\",\n      \"degree\": \"Computer Science\",\n      \"fieldOfStudy\": \"\",\n      \"startDate\": \"2022\",\n      \"endDate\": \"2025\"\n    },\n    {\n      \"school\": \"Lebanese University Faculty of Engineering Second Branch (ULFG2) \u2013 Roumieh\",\n      \"degree\": \"Electrical Engineering\",\n      \"fieldOfStudy\": \"\",\n      \"startDate\": \"2019\",\n      \"endDate\": \"2022\"\n    },\n    {\n      \"school\": \"Lebanese University Faculty of Arts and Architecture (FBAA2) \u2013 Furn el Chebbak\",\n      \"degree\": \"Architecture\",\n      \"fieldOfStudy\": \"\",\n      \"startDate\": \"2018\",\n      \"endDate\": \"2019\"\n    },\n    {\n      \"school\": \"Coll\u00E8ge des S\u0153urs des Saints C\u0153urs \u2013 Ain Saadeh, Ain Najem\",\n      \"degree\": \"French Baccalaureate\",\n      \"fieldOfStudy\": \"Mathematics\",\n      \"startDate\": \"2003\",\n      \"endDate\": \"2018\"\n    }\n  ],\n  \"workExperience\": [],\n  \"projects\": [],\n  \"skills\": [\n    {\n      \"skillName\": \"Object-Oriented Programming\"\n    },\n    {\n      \"skillName\": \"design patterns\"\n    },\n    {\n      \"skillName\": \"database\"\n    },\n    {\n      \"skillName\": \"coding skills\"\n    },\n    {\n      \"skillName\": \"problem-solving skills\"\n    },\n    {\n      \"skillName\": \"C++\"\n    },\n    {\n      \"skillName\": \"Java\"\n    },\n    {\n      \"skillName\": \"Python\"\n    },\n    {\n      \"skillName\": \"HTML\"\n    },\n    {\n      \"skillName\": \"CSS\"\n    },\n    {\n      \"skillName\": \"JavaScript\"\n    },\n    {\n      \"skillName\": \"SQL\"\n    },\n    {\n      \"skillName\": \"Android\"\n    },\n    {\n      \"skillName\": \"React\"\n    },\n    {\n      \"skillName\": \"NodeJs\"\n    },\n    {\n      \"skillName\": \"Slack\"\n    },\n    {\n      \"skillName\": \"Notion\"\n    },\n    {\n      \"skillName\": \"MS Teams\"\n    }\n  ],\n  \"certifications\": [],\n  \"languages\": [\n    {\n      \"languageName\": \"Arabic\",\n      \"proficiency\": \"fluent\"\n    },\n    {\n      \"languageName\": \"French\",\n      \"proficiency\": \"fluent\"\n    },\n    {\n      \"languageName\": \"English\",\n      \"proficiency\": \"fluent\"\n    }\n  ]\n}";
//send to supabase function 
function sendToSupabase(parsedJSON) {
    return __awaiter(this, void 0, void 0, function () {
        var dataJSON, keys, resume, _a, data, error, _b, resume_ID, resume_IDerr, resumeID, _i, _c, key, _d, _e, _f, value, _g, rowData, rowError, error_1;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    _h.trys.push([0, 11, , 12]);
                    dataJSON = JSON.parse(parsedJSON);
                    keys = Object.keys(dataJSON);
                    resume = {};
                    resume[keys[0]] = dataJSON[keys[0]]; //keys[0] = "name"
                    resume[keys[4]] = dataJSON[keys[4]]; //keys[4] = "dateOfBirth"
                    resume[keys[6]] = dataJSON[keys[6]]; //keys[6] = "summary"
                    console.log(resume);
                    return [4 /*yield*/, client.from('resumes').insert(resume)];
                case 1:
                    _a = _h.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        console.error('Error inserting into resume table:', error.message);
                    }
                    else {
                        console.log('Data inserted successfully into resume table:', data);
                    }
                    return [4 /*yield*/, client.from('resumes').select('resumeID').eq('name', resume.name).single()];
                case 2:
                    _b = _h.sent(), resume_ID = _b.data, resume_IDerr = _b.error;
                    if (resume_IDerr) {
                        console.error('Error fetching ID from resumes table:', resume_IDerr.message);
                    }
                    else {
                        resumeID = resume_ID ? resume_ID.resumeID : null;
                        resume.resumeID = resumeID;
                        console.log('Fetching resume ID successfully from resumes table:', resume);
                    }
                    _i = 0, _c = Object.keys(dataJSON);
                    _h.label = 3;
                case 3:
                    if (!(_i < _c.length)) return [3 /*break*/, 10];
                    key = _c[_i];
                    _d = key;
                    switch (_d) {
                        case 'name': return [3 /*break*/, 4];
                        case 'dateOfBirth': return [3 /*break*/, 4];
                        case 'summary': return [3 /*break*/, 4];
                    }
                    return [3 /*break*/, 5];
                case 4: return [3 /*break*/, 9]; //skip the keys already stored in resumes table
                case 5:
                    _e = 0, _f = dataJSON[key];
                    _h.label = 6;
                case 6:
                    if (!(_e < _f.length)) return [3 /*break*/, 9];
                    value = _f[_e];
                    value.resumeID = resume.resumeID; //appending resumeID into value
                    return [4 /*yield*/, client.from(key).insert(value)];
                case 7:
                    _g = _h.sent(), rowData = _g.data, rowError = _g.error;
                    if (rowError) {
                        console.error("Error inserting new row in '".concat(key, "' table:"), rowError.message);
                    }
                    else {
                        console.log("New row  inserted successfully in '".concat(key, "' table:"), rowData);
                    }
                    _h.label = 8;
                case 8:
                    _e++;
                    return [3 /*break*/, 6];
                case 9:
                    _i++;
                    return [3 /*break*/, 3];
                case 10:
                    console.log("Data successfully sent to Supabase");
                    return [3 /*break*/, 12];
                case 11:
                    error_1 = _h.sent();
                    console.error('Error sending to the DB:', error_1);
                    return [3 /*break*/, 12];
                case 12: return [2 /*return*/];
            }
        });
    });
}
exports.sendToSupabase = sendToSupabase;
sendToSupabase(resumeData); //call function
