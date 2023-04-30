module.exports = {
  _appImports: [
    "import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'",
  ],
  _appOutsideComponentCode: `
  const subgraphUri = "http://localhost:8000/subgraphs/name/scaffold-eth/your-contract";
  const apolloClient = new ApolloClient({
    uri: subgraphUri,
    cache: new InMemoryCache(),
  });
  `,
  _appProviderWrappers: ["<ApolloProvider client={apolloClient}>"],
};
