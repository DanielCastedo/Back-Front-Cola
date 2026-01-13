import { ApolloClient, InMemoryCache } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

// 1. Configuración ÚNICA de WebSocket
// Nota: Ya no necesitamos HttpLink ni split
const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:8000/graphql', // Asegúrate de que coincida con tu backend
  
  // Opcional: Configuración para reconexión automática
  retryAttempts: 5,
  keepAlive: 10_000, // Mantener vivo cada 10 seg
}));

// 2. Crear el Cliente 100% WebSocket
export const client = new ApolloClient({
  link: wsLink, // Conectamos directo, sin intermediarios HTTP
  cache: new InMemoryCache(),
});