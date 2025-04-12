"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
/* ROUTE IMPORTS */
const auth_1 = __importDefault(require("./routes/auth"));
const blog_1 = __importDefault(require("./routes/blog"));
const council_list_1 = __importDefault(require("./routes/council-list"));
const events_1 = __importDefault(require("./routes/events"));
const form_1 = __importDefault(require("./routes/form"));
const home_1 = __importDefault(require("./routes/home"));
const news_1 = __importDefault(require("./routes/news"));
const reports_publications_1 = __importDefault(require("./routes/reports-publications"));
const search_1 = __importDefault(require("./routes/search"));
const service_1 = __importDefault(require("./routes/service"));
const shop_1 = __importDefault(require("./routes/shop"));
const user_1 = __importDefault(require("./routes/user"));
const vacancy_1 = __importDefault(require("./routes/vacancy"));
const team_1 = __importDefault(require("./routes/team"));
const stat_1 = __importDefault(require("./routes/stat"));
/* CONFIGURATIONS */
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({
    policy: 'cross-origin',
}));
app.use((0, morgan_1.default)('common'));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
/* ROUTES */
app.get('/', (req, res) => {
    res.send('<html><body><h1>Welcome to the Home Route</h1></body></html>');
});
app.use('/tama/auth', auth_1.default);
app.use('/tama/home', home_1.default);
app.use('/tama/shops', shop_1.default);
app.use('/tama/forms', form_1.default);
app.use('/tama/blogs', blog_1.default);
app.use('/tama/search', search_1.default);
app.use('/tama/team', team_1.default);
app.use('/tama/stat', stat_1.default);
app.use('/tama/news', news_1.default);
app.use('/tama/users', user_1.default);
app.use('/tama/events', events_1.default);
app.use('/tama/vacancies', vacancy_1.default);
app.use('/tama/services', service_1.default);
app.use('/tama/council-lists', council_list_1.default);
app.use('/tama/reports-publications', reports_publications_1.default);
/* SERVER */
const PORT = Number(process.env.PORT) || 8000;
app.listen(PORT, () => {
    console.log(`Server Listening on port ${PORT}`);
});
