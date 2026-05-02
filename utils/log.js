const chalk = require('chalk');
const gradientString = require("gradient-string");
const gradient = gradientString.default;
const { pastel, rainbow, cristal, retro, summer, teen, mind } = gradientString;
const themes = [
  'dream',
  'fiery',
  'pastel',
  'cristal',
  'retro',
  'sunlight',
  'teen',
  'summer',
  'flower',
  'ghost',
];

const theme = themes[Math.floor(Math.random() * themes.length)];
let co;
let error;
if (theme.toLowerCase() === 'blue') {
  co = gradient("#1affa3", "cyan", "pink", "cyan", "#1affa3");
  error = chalk.red.bold;
}

else if (theme == "dream2") {
  cra = gradient("blue", "pink")
  co = gradient("#a200ff", "#21b5ff", "#a200ff")
}
else if (theme.toLowerCase() === 'dream') {
  co = gradient("blue", "pink", "gold", "pink", "blue");
  error = chalk.red.bold;
}
else if (theme.toLowerCase() === 'fiery') {
  co = gradient("#fc2803", "#fc6f03", "#fcba03");
  error = chalk.red.bold;
}
else if (theme.toLowerCase() === 'rainbow') {
  co = rainbow
  error = chalk.red.bold;
}
else if (theme.toLowerCase() === 'pastel') {
  co = pastel
  error = chalk.red.bold;
}
else if (theme.toLowerCase() === 'cristal') {
  co = cristal
  error = chalk.red.bold;
} else if (theme.toLowerCase() === 'red') {
  co = gradient("red", "orange");
  error = chalk.red.bold;
} else if (theme.toLowerCase() === 'aqua') {
  co = gradient("#0030ff", "#4e6cf2");
  error = chalk.blueBright;
} else if (theme.toLowerCase() === 'pink') {
  cra = gradient('purple', 'pink');
  co = gradient("#d94fff", "purple");
} else if (theme.toLowerCase() === 'retro') {
  cra = gradient("#d94fff", "purple");
  co = retro;
} else if (theme.toLowerCase() === 'sunlight') {
  cra = gradient("#f5bd31", "#f5e131");
  co = gradient("orange", "#ffff00", "#ffe600");
} else if (theme.toLowerCase() === 'teen') {
  cra = gradient("#00a9c7", "#853858", "#853858", "#00a9c7");
  co = teen;
} else if (theme.toLowerCase() === 'summer') {
  cra = gradient("#fcff4d", "#4de1ff");
  co = summer;
} else if (theme.toLowerCase() === 'flower') {
  cra = gradient("blue", "purple", "yellow", "#81ff6e");
  co = pastel;
} else if (theme.toLowerCase() === 'ghost') {
  cra = gradient("#0a658a", "#0a7f8a", "#0db5aa");
  co = mind;
} else if (theme === 'hacker') {
  cra = chalk.hex('#4be813');
  co = gradient('#47a127', '#0eed19', '#27f231');
}
else {
  co = gradient("#243aff", "#4687f0", "#5800d4");
  error = chalk.red.bold;
}
module.exports = (text, type) => {
  switch (type) {
    case "warn":
      process.stderr.write(co(`\r[ ERROR ] > ${text}`) + '\n');
      break;
    case "error":
      process.stderr.write(chalk.bold.hex("#ff0000").bold(`\r[ ERROR ]`) + ` > ${text}` + '\n');
      break;
    default:
      process.stderr.write(chalk.bold(co(`\r${String(type).toUpperCase()} ${text}`) + '\n'));
      break;
  }
};

module.exports.loader = (data, option) => {
  switch (option) {
    case "warn":
      console.log(chalk.bold(co("[ WARNING ] > ")) + co(data))
      break;
    case "error":
      console.log(chalk.bold(co("[ ERROR ] > ")) + chalk.bold(co(data)))
      break;
    default:
      console.log(chalk.bold(co("[ LOADING ] > ")) + chalk.bold(co(data)))
      break;
  }
}

module.exports.load = (data, option) => {
  let coloredData = '';

  switch (option) {
    case 'warn':
      coloredData = gradient("blue", "purple", "yellow", "#81ff6e")('[ LOGIN ] >' + data);
      console.log(chalk.bold(coloredData));
      break;
    case 'error':
      coloredData = chalk.bold.hex('#FF0000')('[ ERROR ] >') + chalk.bold.red(data);
      console.log(coloredData);
      break;
    default:
      coloredData = gradient("blue", "purple", "yellow", "#81ff6e")('[ LOGIN ] >' + data);
      console.log(chalk.bold(coloredData));
      break;
  }
};

module.exports.autoLogin = async (onBot, botData) => {
  onBot(botData);
};
module.exports.co = co; 