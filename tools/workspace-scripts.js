module.exports = {
  message: 'NativeScript Plugins ~ made with ❤️  Choose a command to start...',
  pageSize: 32,
  scripts: {
    default: 'nps-i',
    nx: {
      script: 'nx',
      description: 'Execute any command with the @nrwl/cli',
    },
    format: {
      script: 'nx format:write',
      description: 'Format source code of the entire workspace (auto-run on precommit hook)',
    },
    '🔧': {
      script: `npx cowsay "NativeScript plugin demos make developers 😊"`,
      description: '_____________  Apps to demo plugins with  _____________',
    },
    // demos
    apps: {
      '...Vanilla...': {
        script: `npx cowsay "Nothing wrong with vanilla 🍦"`,
        description: ` 🔻 Vanilla`,
      },
      demo: {
        clean: {
          script: 'nx clean demo',
          description: '⚆  Clean  🧹',
        },
        ios: {
          script: 'nx debug demo ios',
          description: '⚆  Run iOS  ',
        },
        android: {
          script: 'nx debug demo android',
          description: '⚆  Run Android  🤖',
        },
      },
    },
    '⚙️': {
      script: `npx cowsay "@/* packages will keep your ⚙️ cranking"`,
      description: '_____________  @/*  _____________',
    },
    // packages
    // build output is always in dist/packages
    '@': {
      // @/rootbeer
      rootbeer: {
        build: {
          script: 'nx run rootbeer:build.all',
          description: '@/rootbeer: Build',
        },
      },
      // @/phone-number-field
      'phone-number-field': {
        build: {
          script: 'nx run phone-number-field:build.all',
          description: '@/phone-number-field: Build',
        },
      },
      // @/floating-tab-bar
      'floating-tab-bar': {
        build: {
          script: 'nx run floating-tab-bar:build.all',
          description: '@/floating-tab-bar: Build',
        },
      },
      'build-all': {
        script: 'nx run-many --target=build.all --all',
        description: 'Build all packages',
      },
    },
    '⚡': {
      script: `npx cowsay "Focus only on source you care about for efficiency ⚡"`,
      description: '_____________  Focus (VS Code supported)  _____________',
    },
    focus: {
      rootbeer: {
        script: 'nx run rootbeer:focus',
        description: 'Focus on @/rootbeer',
      },
      'phone-number-field': {
        script: 'nx run phone-number-field:focus',
        description: 'Focus on @/phone-number-field',
      },
      'floating-tab-bar': {
        script: 'nx run floating-tab-bar:focus',
        description: 'Focus on @/floating-tab-bar',
      },
      reset: {
        script: 'nx g @nativescript/plugin-tools:focus-packages',
        description: 'Reset Focus',
      },
    },
    '.....................': {
      script: `npx cowsay "That's all for now folks ~"`,
      description: '.....................',
    },
  },
};
