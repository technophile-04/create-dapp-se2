# 🏗️ create-dapp-se2 :

Scaffold a new Scaffold-ETH 2 project.

```bash
yarn create dapp-se2
```

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
