# 🏗️ create-dapp-se2 :

Scaffold a new Scaffold-ETH 2 project.

```bash
yarn create dapp-se2
```

You can also pass [flags](https://github.com/technophile-04/create-dapp-se2/blob/ab4713dd1a5eca90f2b7841ce4c2aa78a69443f2/src/utils/parse-arguments-into-options.ts#L10) to skip prompts.

```bash
yarn create dapp-se2 my-se2-dapp --template se-2-hardhat

# or

yarn create dapp-se2 my-se2-dapp --yes
```

# Understanding the structure :

`src/cli.ts` is the entry point for the cli.

`src/main.ts` defines the task using [listr](https://www.npmjs.com/package/listr) and executes them.

`src/tasks` holds each task logic for example one of the task in `src/main.ts` is "Initialize git repo" and the logic for it is present at `src/tasks/init-git-repo`

`src/utils` holds utility / helpers function like parsing cli args, checking for correct template name, showing welcome and outro messages etc.

`src/types.ts` holds all the type

# Trying out locally :

Clone and get into working directory :

```bash
git clone https://github.com/technophile-04/create-dapp-se2.git
cd create-dapp-se2
```

Linking package locally and running watch mode:

```bash
# Make sure you are in create-dapp-se2 directory
yarn link

# This will watch and compile as you edit files
yarn dev
```

Testing :

```bash
# In new terminal
cd ..
mkdir test-dapp-se2

# Running this will execute the local bin file
create-dapp-se2
```

# Stack used :

- [Rollup](https://rollupjs.org) for bundling
- [arg](https://www.npmjs.com/package/arg) for parsing command line arguments
- [chalk](https://www.npmjs.com/package/chalk) for terminal string styling
- [inquirer](https://www.npmjs.com/package/inquirer) for interactive command line user interface
- [listr](https://www.npmjs.com/package/listr) for showing terminal task list
- [execa](https://www.npmjs.com/package/execa) for executing terminal commands
- [pkg-install](https://www.npmjs.com/package/pkg-install) for installing packages
