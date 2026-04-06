const fs = require('fs');
const path = require('path');
const logger = require('./log');

const modulesRoot = path.resolve(__dirname, '../modules');
const commandsPath = path.join(modulesRoot, 'commands');
const eventsPath = path.join(modulesRoot, 'events');
const noprefixPath = path.join(modulesRoot, 'noprefix');

function readModules(directory) {
    if (!fs.existsSync(directory)) return [];
    const entries = fs.readdirSync(directory, { withFileTypes: true });
    let modules = [];

    for (const entry of entries) {
        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            modules = modules.concat(readModules(fullPath));
        } else if (entry.isFile() && entry.name.endsWith('.js')) {
            modules.push(fullPath);
        }
    }

    return modules;
}

function ensureDirectoryExists(directory) {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
}

function loadCommandModules(api, models) {
    const moduleFiles = readModules(commandsPath);
    const loadedFolders = new Set();
    let loadedCount = 0;

    for (const moduleFile of moduleFiles) {
        const absolutePath = path.resolve(moduleFile);

        try {
            delete require.cache[require.resolve(absolutePath)];
            const mdlModule = require(absolutePath);

            if (!mdlModule.config || !mdlModule.run || !mdlModule.config.commandCategory) {
                logger(`Invalid module format: ${absolutePath}`, 'error');
                continue;
            }

            const commandName = mdlModule.config.name || '';
            if (global.client.commands.has(commandName)) {
                logger(`Duplicate module name: ${commandName}`, 'error');
                continue;
            }

            const commandCategoryFolder = path.join(commandsPath, mdlModule.config.commandCategory);
            ensureDirectoryExists(commandCategoryFolder);
            let finalPath = absolutePath;

            if (path.dirname(absolutePath) !== commandCategoryFolder) {
                const newFilePath = path.join(commandCategoryFolder, path.basename(absolutePath));
                if (fs.existsSync(newFilePath)) {
                    logger(`Target module already exists and will be skipped: ${newFilePath}`, 'error');
                    continue;
                }

                fs.renameSync(absolutePath, newFilePath);
                finalPath = newFilePath;
            }

            delete require.cache[require.resolve(finalPath)];
            const updatedModule = require(finalPath);

            if (updatedModule.config.envConfig) {
                global.configModule = global.configModule || {};
                global.config = global.config || {};
                global.configModule[commandName] = global.configModule[commandName] || {};
                global.config[commandName] = global.config[commandName] || {};

                for (const key in updatedModule.config.envConfig) {
                    global.configModule[commandName][key] = global.configModule[commandName][key] ?? updatedModule.config.envConfig[key] ?? '';
                    global.config[commandName][key] = global.configModule[commandName][key];
                }
            }

            if (updatedModule.onLoad) updatedModule.onLoad(api, models);
            global.client.commands.set(commandName, updatedModule);
            loadedFolders.add(path.basename(path.dirname(finalPath)));
            loadedCount++;
        } catch (error) {
            logger(`Error loading module: ${absolutePath}\nDetails: ${error.message}`, 'error');
        }
    }

    if (loadedFolders.size > 0) {
        logger(`Successfully loaded folders: ${[...loadedFolders].join(', ')}`, '[ SUCCESS ]');
    }

    if (loadedCount === 0) {
        logger('No command modules loaded.', '[ WARN ]');
    }
}

function loadSimpleModules(directory, collection, type, requirePathPrefix = '') {
    if (!fs.existsSync(directory)) {
        logger(`Module path not found: ${directory}`, 'error');
        return 0;
    }

    const modules = fs.readdirSync(directory).filter(module => module.endsWith('.js'));
    let loadedCount = 0;

    for (const moduleFile of modules) {
        const absolutePath = path.resolve(directory, moduleFile);

        try {
            delete require.cache[require.resolve(absolutePath)];
            const mdlModule = require(absolutePath);

            if (!mdlModule.config || !mdlModule.config.name || !mdlModule.run) {
                logger(`Invalid module format: ${moduleFile}`, 'error');
                continue;
            }

            if (global.client[collection].has(mdlModule.config.name)) {
                logger(`Duplicate module name: ${mdlModule.config.name}`, 'error');
                continue;
            }

            if (type === 'events' && !mdlModule.config.eventType) {
                logger(`Invalid event module format: ${moduleFile}`, 'error');
                continue;
            }

            if (mdlModule.onLoad) mdlModule.onLoad(api, models);
            global.client[collection].set(mdlModule.config.name, mdlModule);
            loadedCount++;
        } catch (error) {
            logger(`Error loading ${type} module: ${moduleFile}\nDetails: ${error.message}`, 'error');
        }
    }

    return loadedCount;
}

module.exports = async (api, models) => {
    global.loadMdl = function (mdl) {
        if (mdl === 'commands') {
            logger('COMMANDS', '[ LOADING ]');
            loadCommandModules(api, models);
        } else if (mdl === 'events') {
            const loadedCount = loadSimpleModules(eventsPath, 'events', 'events');
            logger(`Successfully loaded ${loadedCount} events`, '[ SUCCESS ]');
        } else if (mdl === 'noprefix') {
            const loadedCount = loadSimpleModules(noprefixPath, 'NPF_commands', 'noprefix');
            logger(`Successfully loaded ${loadedCount} noprefix modules`, '[ SUCCESS ]');
        }
    };

    global.loadMdl('commands');
    global.loadMdl('events');
    global.loadMdl('noprefix');
};
