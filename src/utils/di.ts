/* eslint-disable @typescript-eslint/no-var-requires */
import * as fs from 'fs';
import ConfigHandler from './config-handler';
const modulesConfig = fs.readFileSync("./config/modules.json", "utf-8");
const MODS = JSON.parse(modulesConfig);

export const loadModules = (config: ConfigHandler) => ( check() && inject(load(), config) );

function check(): boolean {
  const names = MODS.map(m => (m.name));
  if ( [...new Set(names)].length !== names.length ){
    throw new Error("Duplicated module names");
  }

  return true;
}

const load = () => (
  Object.keys(MODS)
    .map(name => {
        const mod = MODS[name];
        const Clazz = require(`../modules/${mod.file}`).default;
        const instance = new Clazz();
        const bootable = Reflect.has(instance, 'boot');
        return {
          mod, instance, bootable
        }
      })
    .reduce((prev, curr) => {
      const obj = {
        config: curr.mod,
        bootable: curr.bootable,
        instance: curr.instance
      };
      prev[curr.mod.name] = obj;
      return prev;
    }, {})
  );

const inject = (mods, config: ConfigHandler) => (
  Object.keys(mods)
    .map(k => mods[k])
    .map(mod => {
      console.log("  >> Injecting global configuration into module", mod.config.name);
      mod.instance['config'] = config;

      mod.config.depends && mod.config.depends.forEach(dep => {
        if( mod.instance[dep] ) {
          console.log(`  Method '${dep}' not found on class of module '${mod.config.name}'`);
        } else {
          console.log("  >> Injecting", mods[dep].config.name, "into module", mod.config.name);
          mod.instance[dep] = mods[dep].instance;
        }
      });
      
      return mod;
    })
  );
  