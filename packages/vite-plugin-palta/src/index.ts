import { createFilter, Plugin } from "vite";
import { transform } from "@swc/core";

const palta = (): Plugin => {
  const typescriptFilter = createFilter(/\.tsx$/);
  const javascriptFilter = createFilter(/\.jsx$/);

  return {
    name: "palta",
    config: () => ({
      esbuild: false,
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
        },
      });

      console.log(result.code)
      return result;
    },
  };
};


export default palta;