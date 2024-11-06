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

import PaltaLogo from '/palta-logo.svg?url'

// @Palta.component
export default function Header() {
  return (
    <nav className='w-full m-1 bg-slate-400 rounded p-2 flex items-center h-14 shadow-md gap-2'>
      <img src={PaltaLogo} className='w-5' />
      <h1 className="text-3xl font-bold text-gray-800 uppercase">Palta</h1>
    </nav>
  );
}