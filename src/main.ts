import {Start} from "./index";
import {MainController} from "./controllers/main.controller";
import {StartService} from "./service/start.service";
import {Helper} from "./service/helper";
import {TemplatesText} from "./templates/templates.text";
import {WaterService} from "./service/water.service";
import {WaterParser} from "./parsers/water.parser";
import {ElectricityParser} from "./parsers/electricity.parser";
import {ElectricityService} from "./service/electricity.service";

const helper = new Helper()
const templatesText = new TemplatesText()
const startService = new StartService(templatesText)
const mainController = new MainController(startService, helper)
const waterParser = new WaterParser()
const electricityParser = new ElectricityParser()
const electricityService = new ElectricityService(electricityParser, helper)
const waterService = new WaterService(waterParser, helper)
const start = new Start(mainController, waterService, electricityService)

start.botOn()
