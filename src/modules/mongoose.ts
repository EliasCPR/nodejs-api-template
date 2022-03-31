import Bootable from "../utils/bootable";
import ConfigHandler from "../utils/config-handler";
import Logger from "./logger";

import { connect } from 'mongoose';

export default class Mongoose implements Bootable {

  config: ConfigHandler
  logger: Logger;
  mongoose;

  async boot(){
    const MONGO_URI = process.env.MONGO_URI || this.config.contents.mongoUri || "mongodb://mongodb:27017/ressarcimento";
    this.mongoose = await connect(MONGO_URI);
    this.logger.info("Mongoose started: " + this.state);
  }

  get state(){
    if( this.mongoose && this.mongoose.connections && this.mongoose.connections.length > 0) {
      const conn = this.mongoose.connections[0];
      return conn.states[conn._readyState];  
    } else {
      return "Unkown state"
    }
  }

}
