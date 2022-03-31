import { createLogger } from "bunyan";
import ConfigHandler from "../utils/config-handler";

const {ENV, NODE_ENV} = process.env;
const isProd = (NODE_ENV === "production" || ENV === "production");

type LoggerObj = {
  debug, info, warn, error
}
export default class Logger {

  config: ConfigHandler
  logger: LoggerObj

  constructor(){
    this.logger = isProd ? createLogger({name: 'Default'}) : console;
  }

  debug(...msg){
    this.logger.debug(msg.join(" "));
  }

  info(...msg){
    this.logger.info(msg.join(" "));
  }

  warn(...msg){
    this.logger.warn(msg.join(" "));
  }

  error(...msg){
    this.logger.error(msg.join(" "));
  }

}
