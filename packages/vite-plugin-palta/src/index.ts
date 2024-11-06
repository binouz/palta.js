import { createFilter, Plugin } from "vite";
import { transform } from "@swc/core";

const palta = (): Plugin => {
  const typescriptFilter = createFilter(/\.tsx$/);
  const javascriptFilter = createFilter(/\.jsx$/);

  return {
    name: "palta",
    config: () => ({
      esbuild: {
        exclude: /\.[tj]sx?$/,
      },
    }),
    async transform(code, id) {
      const isTS = typescriptFilter(id);

      if (!javascriptFilter(id) && !isTS) {
        return;
      }

      const result = await transform(code, {
        jsc: {
          parser: isTS
            ? {
                syntax: "typescript",
                tsx: true,
              }
            : {
                syntax: "ecmascript",
                jsx: true,
              },
          experimental: {
            plugins: [["swc-plugin-palta", {}]],
          },
          transform: {
            react: {
              pragma: "UnevaluatedJSXElement",
            },
          },
        },
      });

      return result;
    },
  };
};


export default palta;