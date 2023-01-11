import "dotenv/config";

const { NODE_ENV, REACT_APP_MODE } = process.env;

const getVariableValue = (MODE: string | undefined, name: string) =>
  process.env[`${name}_${MODE}`] || process.env[name];

const IS_PRODUCTION = NODE_ENV === "production";

const MODE = REACT_APP_MODE || (IS_PRODUCTION ? "PROD" : undefined);

const GMAIL_EMAIL = getVariableValue(MODE, "GMAIL_EMAIL");
const GMAIL_PASSWORD = getVariableValue(MODE, "GMAIL_PASSWORD");

const MIROSLAV_PETROV_URL = getVariableValue(MODE, "MIROSLAV_PETROV_URL") || "";

const PORT = getVariableValue(MODE, "PORT") || 4000;

export const Config = {
  NODE_ENV,
  IS_PRODUCTION,
  MODE,
  PORT,
  GMAIL_EMAIL,
  GMAIL_PASSWORD,
  MIROSLAV_PETROV_URL,
};
