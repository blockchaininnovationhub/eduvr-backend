export default async (func) => {
  if (process.env.NODE_ENV === "dev") {
    const { default: dotenv } = await import("dotenv");
    dotenv.config();
  }

  func();
};
