/**
 * Copyright 2024 Aubin REBILLAT
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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