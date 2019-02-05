# nodepelle
node.js project for sending sniffed can data from an Estyma Igneo pellet furnace controller (as used in Vølund Pellux 100).

# Getting started
Make an account with ThingSpeak and get the channel id, api read and write keys. copy the config_sample to a new file config_foo. Then run export NODE_ENV=config_foo followed by node pellemain.js.

Dependencies are (at least):
* [socketcan](https://www.npmjs.com/package/socketcan)
* [config](https://www.npmjs.com/package/config)
