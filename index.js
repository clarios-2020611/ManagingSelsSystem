import { initServer } from './configs/app.js';
import { config } from "dotenv"; //Decirle a Node que se usa DOTENV
import { connect } from "./configs/mongo.js";

config()
initServer()
connect()

//MOSTRAR AL PROFE To load an ES module, set "type": "module" in the package.json or use the .mjs extension.