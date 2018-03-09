const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  install() {
    this.yarnInstall(
      [
        '@gojob/tslint-config',
        '@types/node',
        'chokidar-cli',
        'concurrently',
        'nodemon',
        'prettier',
        'tslint',
        'tslint-config-prettier',
        'tslint-plugin-prettier',
        'ts-node',
        'typescript',
      ],
      {
        dev: true,
      },
    );
  }

  configuring() {
    this._copy(
      '.gitignore',
      '.prettierrc',
      'CHANGELOG.md',
      'index.js',
      'nodemon.json',
      'README.md',
      'tsconfig.json',
      'tslint.json',

      'src/main.ts',
    );
  }


  /**
   * Complete package.json
   */
  package() {
    const pkgPath = this.destinationPath('package.json');
    const pkg = this.fs.readJSON(pkgPath) || {};

    const scripts = {
      'tslint-run': './node_modules/.bin/tslint -c ./tslint.json -p ./tsconfig.json -t verbose',
      lint: 'yarn tslint-run',
      'lint:fix': 'yarn lint --fix',
      'lint:watch': './node_modules/.bin/chokidar "./src/**/*.ts" -c "yarn lint" --initial --verbose',
      start: 'yarn lint && yarn start:nolinter',
      'start:nolinter': 'node index.js',
      'start:watch': './node_modules/.bin/concurrently -k -p "[{name}]" -n "TypeScript,Node" -c "cyan.bold,green.bold" "yarn run lint:watch" "yarn run start:watch:nolinter"',
      'start:watch:nolinter': './node_modules/.bin/nodemon --ignore "*.test.ts"',
      'prestart:prod': './node_modules/.bin/tsc',
      'start:prod': 'node dist/main.js',
    };

    pkg['pre-commit'] = pkg['pre-commit'] || [];
    if (pkg['pre-commit'].indexOf('lint') < 0) {
      pkg['pre-commit'].push('lint');
    }

    pkg.scripts = { ...pkg.scripts, ...scripts };

    this.fs.writeJSON(pkgPath, pkg, null, 4);
  }

  /**
   * Copy a files from templates to destination
   * @param {string[]} files
   * @private
   */
  _copy(...files) {
    files.forEach((file) => {
      this.fs.copy(
        this.templatePath(file),
        this.destinationPath(file),
      );
    });
  }
};
