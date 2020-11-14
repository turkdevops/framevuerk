const path = require('path');

const dashCase = require('../utils/dashCase');

const getData = (str) => (str.match(/(@data)(.*)(?=)/g) || []).map((item) => {
  const parsed = item.substr(5).split('=');
  return `${parsed[0].trim()}: ${parsed.slice(1).join('=').trim()}`;
}).join(',');

const getConfigs = (str) => {
  const ret = {};
  (str.match(new RegExp('(@config)(.*)', 'g')) || []).forEach((configLine) => {
    const splited = configLine.split(' ');
    // eslint-disable-next-line no-eval
    ret[splited[1]] = eval(splited.slice(2).join(' '));
  });
  return ret;
};

const removeData = (str) => str.replace(/(@data|@config)(.*)(?=)/g, '').trim();

module.exports = () => ({
  name: 'example',
  transform: (source, id) => {
    if (!id.endsWith('.example')) return null;

    const data = getData(source);
    const configs = getConfigs(source);
    const template = removeData(source);

    const componentName = (() => {
      let ret = path.basename(id);;
      ret = ret.substring(0, ret.indexOf('.vue'));
      return dashCase(ret);
    })();

    const code = `
      window.framevuerkExamples = window.framevuerkExamples || {};
      window.framevuerkExamples['${componentName}'] = window.framevuerkExamples['${componentName}'] || [];
      window.framevuerkExamples['${componentName}'].push({
        template: ${JSON.stringify(template)},
        data: {${data}},
        configs: ${JSON.stringify(configs)},
      });
    `;
    return {
      code,
      map: {
        mappings: ''
      }
    };
  },
});
