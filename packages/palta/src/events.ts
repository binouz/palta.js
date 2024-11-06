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

import { EventName as EventNameDef } from "./runtime";

export type EventName = EventNameDef;

export const EVENT_MAP: Record<EventName, keyof HTMLElementEventMap> = {
  onCopy: "copy",

  onCut: "cut",
  onPaste: "paste",

  // Composition Events
  onCompositionEnd: "compositionend",
  onCompositionStart: "compositionstart",
  onCompositionUpdate: "compositionupdate",

  // Focus Events
  onFocus: "focus",
  onBlur: "blur",

  // Form Events
  onChange: "change",
  onBeforeInput: "beforeinput",
  onInput: "input",
  onReset: "reset",
  onSubmit: "submit",
  onInvalid: "invalid",

  // Image Events
  onLoad: "load",
  onError: "error",

  // Keyboard Events
  onKeyDown: "keydown",
  onKeyPress: "keypress",
  onKeyUp: "keyup",

  // Media Events
  onAbort: "abort",
  onCanPlay: "canplay",
  onCanPlayThrough: "canplaythrough",
  onDurationChange: "durationchange",
  onEmptied: "emptied",
  // TODO: onEncrypted: 'encrypted',
  onEnded: "ended",
  onLoadedData: "loadeddata",
  onLoadedMetadata: "loadedmetadata",
  onLoadStart: "loadstart",
  onPause: "pause",
  onPlay: "play",
  onPlaying: "playing",
  onProgress: "progress",
  onRateChange: "ratechange",
  onResize: "resize",
  onSeeked: "seeked",
  onSeeking: "seeking",
  onStalled: "stalled",
  onSuspend: "suspend",
  onTimeUpdate: "timeupdate",
  onVolumeChange: "volumechange",
  onWaiting: "waiting",

  // Mouse Events
  onAuxClick: "auxclick",
  onClick: "click",
  onContextMenu: "contextmenu",
  onDoubleClick: "dblclick",
  onDrag: "drag",
  onDragEnd: "dragend",
  onDragEnter: "dragenter",
  // TODO: onDragExit: 'dragexit',
  onDragLeave: "dragleave",
  onDragOver: "dragover",
  onDragStart: "dragstart",
  onDrop: "drop",
  onMouseDown: "mousedown",
  onMouseEnter: "mouseenter",
  onMouseLeave: "mouseleave",
  onMouseMove: "mousemove",
  onMouseOut: "mouseout",
  onMouseOver: "mouseover",
  onMouseUp: "mouseup",

  // Selection Events
  onSelect: "select",

  // Touch Events
  onTouchCancel: "touchcancel",
  onTouchEnd: "touchend",
  onTouchMove: "touchmove",
  onTouchStart: "touchstart",

  // Pointer Events
  onPointerDown: "pointerdown",
  onPointerMove: "pointermove",
  onPointerUp: "pointerup",
  onPointerCancel: "pointercancel",
  onPointerEnter: "pointerenter",
  onPointerLeave: "pointerleave",
  onPointerOver: "pointerover",
  onPointerOut: "pointerout",
  onGotPointerCapture: "gotpointercapture",
  onLostPointerCapture: "lostpointercapture",

  // UI Events
  onScroll: "scroll",

  // Wheel Events
  onWheel: "wheel",

  // Animation Events
  onAnimationStart: "animationstart",
  onAnimationEnd: "animationend",
  onAnimationIteration: "animationiteration",

  // Transition Events
  onTransitionEnd: "transitionend",
};

export const EVENT_NAME = Object.keys(EVENT_MAP);
