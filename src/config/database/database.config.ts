export interface DatabaseConfig {
  host: string;
  port: number;
  uri: string;
}
export const database_config = () => ({
  database: {
    // host: process.env.DB_URI,
    port: parseInt(process.env.DB_PORT, 10),
    uri: process.env.DB_URI,
  },
});
