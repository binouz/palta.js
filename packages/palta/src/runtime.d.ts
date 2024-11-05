import type * as CSS from "csstype";

import { PaltaElement, PaltaNode } from "./types";

type Booleanish = boolean | "true" | "false";

type NativeElement = Element;
type NativeEvent = Event;
type NativeAnimationEvent = AnimationEvent;
type NativeClipboardEvent = ClipboardEvent;
type NativeCompositionEvent = CompositionEvent;
type NativeDragEvent = DragEvent;
type NativeFocusEvent = FocusEvent;
type NativeKeyboardEvent = KeyboardEvent;
type NativeMouseEvent = MouseEvent;
type NativeTouchEvent = TouchEvent;
type NativePointerEvent = PointerEvent;
type NativeTransitionEvent = TransitionEvent;
type NativeUIEvent = UIEvent;
type NativeWheelEvent = WheelEvent;

namespace Palta {
  type AriaAttributes = {
    /** Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. */
    "aria-activedescendant"?: string | undefined;
    /** Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. */
    "aria-atomic"?: Booleanish | undefined;
    /**
     * Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be
     * presented if they are made.
     */
    "aria-autocomplete"?: "none" | "inline" | "list" | "both" | undefined;
    /** Indicates an element is being modified and that assistive technologies MAY want to wait until the modifications are complete before exposing them to the user. */
    /**
     * Defines a string value that labels the current element, which is intended to be converted into Braille.
     * @see aria-label.
     */
    "aria-braillelabel"?: string | undefined;
    /**
     * Defines a human-readable, author-localized abbreviated description for the role of an element, which is intended to be converted into Braille.
     * @see aria-roledescription.
     */
    "aria-brailleroledescription"?: string | undefined;
    "aria-busy"?: Booleanish | undefined;
    /**
     * Indicates the current "checked" state of checkboxes, radio buttons, and other widgets.
     * @see aria-pressed @see aria-selected.
     */
    "aria-checked"?: boolean | "false" | "mixed" | "true" | undefined;
    /**
     * Defines the total number of columns in a table, grid, or treegrid.
     * @see aria-colindex.
     */
    "aria-colcount"?: number | undefined;
    /**
     * Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid.
     * @see aria-colcount @see aria-colspan.
     */
    "aria-colindex"?: number | undefined;
    /**
     * Defines a human readable text alternative of aria-colindex.
     * @see aria-rowindextext.
     */
    "aria-colindextext"?: string | undefined;
    /**
     * Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid.
     * @see aria-colindex @see aria-rowspan.
     */
    "aria-colspan"?: number | undefined;
    /**
     * Identifies the element (or elements) whose contents or presence are controlled by the current element.
     * @see aria-owns.
     */
    "aria-controls"?: string | undefined;
    /** Indicates the element that represents the current item within a container or set of related elements. */
    "aria-current"?:
      | boolean
      | "false"
      | "true"
      | "page"
      | "step"
      | "location"
      | "date"
      | "time"
      | undefined;
    /**
     * Identifies the element (or elements) that describes the object.
     * @see aria-labelledby
     */
    "aria-describedby"?: string | undefined;
    /**
     * Defines a string value that describes or annotates the current element.
     * @see related aria-describedby.
     */
    "aria-description"?: string | undefined;
    /**
     * Identifies the element that provides a detailed, extended description for the object.
     * @see aria-describedby.
     */
    "aria-details"?: string | undefined;
    /**
     * Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
     * @see aria-hidden @see aria-readonly.
     */
    "aria-disabled"?: Booleanish | undefined;
    /**
     * Indicates what functions can be performed when a dragged object is released on the drop target.
     * @deprecated in ARIA 1.1
     */
    "aria-dropeffect"?:
      | "none"
      | "copy"
      | "execute"
      | "link"
      | "move"
      | "popup"
      | undefined;
    /**
     * Identifies the element that provides an error message for the object.
     * @see aria-invalid @see aria-describedby.
     */
    "aria-errormessage"?: string | undefined;
    /** Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. */
    "aria-expanded"?: Booleanish | undefined;
    /**
     * Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion,
     * allows assistive technology to override the general default of reading in document source order.
     */
    "aria-flowto"?: string | undefined;
    /**
     * Indicates an element's "grabbed" state in a drag-and-drop operation.
     * @deprecated in ARIA 1.1
     */
    "aria-grabbed"?: Booleanish | undefined;
    /** Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. */
    "aria-haspopup"?:
      | boolean
      | "false"
      | "true"
      | "menu"
      | "listbox"
      | "tree"
      | "grid"
      | "dialog"
      | undefined;
    /**
     * Indicates whether the element is exposed to an accessibility API.
     * @see aria-disabled.
     */
    "aria-hidden"?: Booleanish | undefined;
    /**
     * Indicates the entered value does not conform to the format expected by the application.
     * @see aria-errormessage.
     */
    "aria-invalid"?:
      | boolean
      | "false"
      | "true"
      | "grammar"
      | "spelling"
      | undefined;
    /** Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. */
    "aria-keyshortcuts"?: string | undefined;
    /**
     * Defines a string value that labels the current element.
     * @see aria-labelledby.
     */
    "aria-label"?: string | undefined;
    /**
     * Identifies the element (or elements) that labels the current element.
     * @see aria-describedby.
     */
    "aria-labelledby"?: string | undefined;
    /** Defines the hierarchical level of an element within a structure. */
    "aria-level"?: number | undefined;
    /** Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. */
    "aria-live"?: "off" | "assertive" | "polite" | undefined;
    /** Indicates whether an element is modal when displayed. */
    "aria-modal"?: Booleanish | undefined;
    /** Indicates whether a text box accepts multiple lines of input or only a single line. */
    "aria-multiline"?: Booleanish | undefined;
    /** Indicates that the user may select more than one item from the current selectable descendants. */
    "aria-multiselectable"?: Booleanish | undefined;
    /** Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. */
    "aria-orientation"?: "horizontal" | "vertical" | undefined;
    /**
     * Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship
     * between DOM elements where the DOM hierarchy cannot be used to represent the relationship.
     * @see aria-controls.
     */
    "aria-owns"?: string | undefined;
    /**
     * Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value.
     * A hint could be a sample value or a brief description of the expected format.
     */
    "aria-placeholder"?: string | undefined;
    /**
     * Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
     * @see aria-setsize.
     */
    "aria-posinset"?: number | undefined;
    /**
     * Indicates the current "pressed" state of toggle buttons.
     * @see aria-checked @see aria-selected.
     */
    "aria-pressed"?: boolean | "false" | "mixed" | "true" | undefined;
    /**
     * Indicates that the element is not editable, but is otherwise operable.
     * @see aria-disabled.
     */
    "aria-readonly"?: Booleanish | undefined;
    /**
     * Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified.
     * @see aria-atomic.
     */
    "aria-relevant"?:
      | "additions"
      | "additions removals"
      | "additions text"
      | "all"
      | "removals"
      | "removals additions"
      | "removals text"
      | "text"
      | "text additions"
      | "text removals"
      | undefined;
    /** Indicates that user input is required on the element before a form may be submitted. */
    "aria-required"?: Booleanish | undefined;
    /** Defines a human-readable, author-localized description for the role of an element. */
    "aria-roledescription"?: string | undefined;
    /**
     * Defines the total number of rows in a table, grid, or treegrid.
     * @see aria-rowindex.
     */
    "aria-rowcount"?: number | undefined;
    /**
     * Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid.
     * @see aria-rowcount @see aria-rowspan.
     */
    "aria-rowindex"?: number | undefined;
    /**
     * Defines a human readable text alternative of aria-rowindex.
     * @see aria-colindextext.
     */
    "aria-rowindextext"?: string | undefined;
    /**
     * Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid.
     * @see aria-rowindex @see aria-colspan.
     */
    "aria-rowspan"?: number | undefined;
    /**
     * Indicates the current "selected" state of various widgets.
     * @see aria-checked @see aria-pressed.
     */
    "aria-selected"?: Booleanish | undefined;
    /**
     * Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
     * @see aria-posinset.
     */
    "aria-setsize"?: number | undefined;
    /** Indicates if items in a table or grid are sorted in ascending or descending order. */
    "aria-sort"?: "none" | "ascending" | "descending" | "other" | undefined;
    /** Defines the maximum allowed value for a range widget. */
    "aria-valuemax"?: number | undefined;
    /** Defines the minimum allowed value for a range widget. */
    "aria-valuemin"?: number | undefined;
    /**
     * Defines the current value for a range widget.
     * @see aria-valuetext.
     */
    "aria-valuenow"?: number | undefined;
    /** Defines the human readable text alternative of aria-valuenow for a range widget. */
    "aria-valuetext"?: string | undefined;
  };

  type AriaRole =
    | "alert"
    | "alertdialog"
    | "application"
    | "article"
    | "banner"
    | "button"
    | "cell"
    | "checkbox"
    | "columnheader"
    | "combobox"
    | "complementary"
    | "contentinfo"
    | "definition"
    | "dialog"
    | "directory"
    | "document"
    | "feed"
    | "figure"
    | "form"
    | "grid"
    | "gridcell"
    | "group"
    | "heading"
    | "img"
    | "link"
    | "list"
    | "listbox"
    | "listitem"
    | "log"
    | "main"
    | "marquee"
    | "math"
    | "menu"
    | "menubar"
    | "menuitem"
    | "menuitemcheckbox"
    | "menuitemradio"
    | "navigation"
    | "none"
    | "note"
    | "option"
    | "presentation"
    | "progressbar"
    | "radio"
    | "radiogroup"
    | "region"
    | "row"
    | "rowgroup"
    | "rowheader"
    | "scrollbar"
    | "search"
    | "searchbox"
    | "separator"
    | "slider"
    | "spinbutton"
    | "status"
    | "switch"
    | "tab"
    | "table"
    | "tablist"
    | "tabpanel"
    | "term"
    | "textbox"
    | "timer"
    | "toolbar"
    | "tooltip"
    | "tree"
    | "treegrid"
    | "treeitem"
    | (string & {});

  type HTMLAttributeReferrerPolicy =
    | ""
    | "no-referrer"
    | "no-referrer-when-downgrade"
    | "origin"
    | "origin-when-cross-origin"
    | "same-origin"
    | "strict-origin"
    | "strict-origin-when-cross-origin"
    | "unsafe-url";

  type HTMLAttributeAnchorTarget =
    | "_self"
    | "_blank"
    | "_parent"
    | "_top"
    | (string & {});

  type CrossOrigin = "anonymous" | "use-credentials" | "" | undefined;

  type HTMLElementTypedEvent<
    T extends NativeElement = NativeElement,
    E extends NativeEvent = NativeEvent
  > = Omit<E, "target" | "currentTarget"> & {
    currentTarget: T;
    target: T;
  };

  type Event<T extends NativeElement = NativeElement> = HTMLElementTypedEvent<
    T,
    NativeEvent
  >;
  type ClipboardEvent<T extends NativeElement = NativeElement> =
    HTMLElementTypedEvent<T, NativeClipboardEvent>;
  type CompositionEvent<T extends NativeElement = NativeElement> =
    HTMLElementTypedEvent<T, NativeCompositionEvent>;
  type FocusEvent<T extends NativeElement = NativeElement> =
    HTMLElementTypedEvent<T, NativeFocusEvent>;
  type KeyboardEvent<T extends NativeElement = NativeElement> =
    HTMLElementTypedEvent<T, NativeKeyboardEvent>;
  type MouseEvent<T extends NativeElement = NativeElement> =
    HTMLElementTypedEvent<T, NativeMouseEvent>;
  type DragEvent<T extends NativeElement = NativeElement> =
    HTMLElementTypedEvent<T, NativeDragEvent>;
  type TouchEvent<T extends NativeElement = NativeElement> =
    HTMLElementTypedEvent<T, NativeTouchEvent>;
  type PointerEvent<T extends NativeElement = NativeElement> =
    HTMLElementTypedEvent<T, NativePointerEvent>;
  type UIEvent<T extends NativeElement = NativeElement> = HTMLElementTypedEvent<
    T,
    NativeUIEvent
  >;
  type WheelEvent<T extends NativeElement = NativeElement> =
    HTMLElementTypedEvent<T, NativeWheelEvent>;
  type AnimationEvent<T extends NativeElement = NativeElement> =
    HTMLElementTypedEvent<T, NativeAnimationEvent>;
  type TransitionEvent<T extends NativeElement = NativeElement> =
    HTMLElementTypedEvent<T, NativeTransitionEvent>;

  type EventHandlerFunc<E> = (event: E) => void;

  type EventHandler<T extends NativeElement = NativeElement> = EventHandlerFunc<
    Event<T>
  >;
  type ClipboardEventHandler<T extends NativeElement = NativeElement> =
    EventHandlerFunc<ClipboardEvent<T>>;
  type CompositionEventHandler<T extends NativeElement = NativeElement> =
    EventHandlerFunc<CompositionEvent<T>>;
  type FocusEventHandler<T extends NativeElement = NativeElement> =
    EventHandlerFunc<FocusEvent<T>>;
  type KeyboardEventHandler<T extends NativeElement = NativeElement> =
    EventHandlerFunc<KeyboardEvent<T>>;
  type MouseEventHandler<T extends NativeElement = NativeElement> =
    EventHandlerFunc<MouseEvent<T>>;
  type DragEventHandler<T extends NativeElement = NativeElement> =
    EventHandlerFunc<DragEvent<T>>;
  type TouchEventHandler<T extends NativeElement = NativeElement> =
    EventHandlerFunc<TouchEvent<T>>;
  type PointerEventHandler<T extends NativeElement = NativeElement> =
    EventHandlerFunc<PointerEvent<T>>;
  type UIEventHandler<T extends NativeElement = NativeElement> =
    EventHandlerFunc<UIEvent<T>>;
  type WheelEventHandler<T extends NativeElement = NativeElement> =
    EventHandlerFunc<WheelEvent<T>>;
  type AnimationEventHandler<T extends NativeElement = NativeElement> =
    EventHandlerFunc<AnimationEvent<T>>;
  type TransitionEventHandler<T extends NativeElement = NativeElement> =
    EventHandlerFunc<TransitionEvent<T>>;

  export type DOMEventHandlers<T extends NativeElement = NativeElement> = {
    // Clipboard Events
    onCopy?: ClipboardEventHandler<T> | undefined;
    onCut?: ClipboardEventHandler<T> | undefined;
    onPaste?: ClipboardEventHandler<T> | undefined;

    // Composition Events
    onCompositionEnd?: CompositionEventHandler<T> | undefined;
    onCompositionStart?: CompositionEventHandler<T> | undefined;
    onCompositionUpdate?: CompositionEventHandler<T> | undefined;

    // Focus Events
    onFocus?: FocusEventHandler<T> | undefined;
    onBlur?: FocusEventHandler<T> | undefined;

    // Form Events
    onChange?: EventHandler<T> | undefined;
    onBeforeInput?: EventHandler<T> | undefined;
    onInput?: EventHandler<T> | undefined;
    onReset?: EventHandler<T> | undefined;
    onSubmit?: EventHandler<T> | undefined;
    onInvalid?: EventHandler<T> | undefined;

    // Image Events
    onLoad?: EventHandler<T> | undefined;
    onError?: EventHandler<T> | undefined;

    // Keyboard Events
    onKeyDown?: KeyboardEventHandler<T> | undefined;
    /** @deprecated Use `onKeyUp` or `onKeyDown` instead */
    onKeyPress?: KeyboardEventHandler<T> | undefined;
    onKeyUp?: KeyboardEventHandler<T> | undefined;

    // Media Events
    onAbort?: EventHandler<T> | undefined;
    onCanPlay?: EventHandler<T> | undefined;
    onCanPlayThrough?: EventHandler<T> | undefined;
    onDurationChange?: EventHandler<T> | undefined;
    onEmptied?: EventHandler<T> | undefined;
    // TODO: onEncrypted?: EventHandler<T> | undefined;
    onEnded?: EventHandler<T> | undefined;
    onLoadedData?: EventHandler<T> | undefined;
    onLoadedMetadata?: EventHandler<T> | undefined;
    onLoadStart?: EventHandler<T> | undefined;
    onPause?: EventHandler<T> | undefined;
    onPlay?: EventHandler<T> | undefined;
    onPlaying?: EventHandler<T> | undefined;
    onProgress?: EventHandler<T> | undefined;
    onRateChange?: EventHandler<T> | undefined;
    onResize?: EventHandler<T> | undefined;
    onSeeked?: EventHandler<T> | undefined;
    onSeeking?: EventHandler<T> | undefined;
    onStalled?: EventHandler<T> | undefined;
    onSuspend?: EventHandler<T> | undefined;
    onTimeUpdate?: EventHandler<T> | undefined;
    onVolumeChange?: EventHandler<T> | undefined;
    onWaiting?: EventHandler<T> | undefined;

    // MouseEvents
    onAuxClick?: MouseEventHandler<T> | undefined;
    onClick?: MouseEventHandler<T> | undefined;
    onContextMenu?: MouseEventHandler<T> | undefined;
    onDoubleClick?: MouseEventHandler<T> | undefined;
    onDrag?: DragEventHandler<T> | undefined;
    onDragEnd?: DragEventHandler<T> | undefined;
    onDragEnter?: DragEventHandler<T> | undefined;
    // TODO: onDragExit?: DragEventHandler<T> | undefined;
    onDragLeave?: DragEventHandler<T> | undefined;
    onDragOver?: DragEventHandler<T> | undefined;
    onDragStart?: DragEventHandler<T> | undefined;
    onDrop?: DragEventHandler<T> | undefined;
    onMouseDown?: MouseEventHandler<T> | undefined;
    onMouseEnter?: MouseEventHandler<T> | undefined;
    onMouseLeave?: MouseEventHandler<T> | undefined;
    onMouseMove?: MouseEventHandler<T> | undefined;
    onMouseOut?: MouseEventHandler<T> | undefined;
    onMouseOver?: MouseEventHandler<T> | undefined;
    onMouseUp?: MouseEventHandler<T> | undefined;

    // Selection Events
    onSelect?: EventHandler<T> | undefined;

    // Touch Events
    onTouchCancel?: TouchEventHandler<T> | undefined;
    onTouchEnd?: TouchEventHandler<T> | undefined;
    onTouchMove?: TouchEventHandler<T> | undefined;
    onTouchStart?: TouchEventHandler<T> | undefined;

    // Pointer Events
    onPointerDown?: PointerEventHandler<T> | undefined;
    onPointerMove?: PointerEventHandler<T> | undefined;
    onPointerUp?: PointerEventHandler<T> | undefined;
    onPointerCancel?: PointerEventHandler<T> | undefined;
    onPointerEnter?: PointerEventHandler<T> | undefined;
    onPointerLeave?: PointerEventHandler<T> | undefined;
    onPointerOver?: PointerEventHandler<T> | undefined;
    onPointerOut?: PointerEventHandler<T> | undefined;
    onGotPointerCapture?: PointerEventHandler<T> | undefined;
    onLostPointerCapture?: PointerEventHandler<T> | undefined;

    // UI Events
    onScroll?: UIEventHandler<T> | undefined;

    // Wheel Events
    onWheel?: WheelEventHandler<T> | undefined;

    // Animation Events
    onAnimationStart?: AnimationEventHandler<T> | undefined;
    onAnimationEnd?: AnimationEventHandler<T> | undefined;
    onAnimationIteration?: AnimationEventHandler<T> | undefined;

    // Transition Events
    onTransitionEnd?: TransitionEventHandler<T> | undefined;
  };

  export type HTMLAttributes = {
    accessKey?: string | undefined;
    autoCapitalize?:
      | "off"
      | "none"
      | "on"
      | "sentences"
      | "words"
      | "characters"
      | undefined
      | (string & {});
    autoFocus?: boolean | undefined;
    className?: string | undefined;
    contentEditable?: Booleanish | "inherit" | "plaintext-only" | undefined;
    contextMenu?: string | undefined;
    dir?: string | undefined;
    draggable?: Booleanish | undefined;
    enterKeyHint?:
      | "enter"
      | "done"
      | "go"
      | "next"
      | "previous"
      | "search"
      | "send"
      | undefined;
    hidden?: boolean | undefined;
    id?: string | undefined;
    lang?: string | undefined;
    nonce?: string | undefined;
    slot?: string | undefined;
    spellCheck?: Booleanish | undefined;
    style?: CSS.Properties | undefined;
    tabIndex?: number | undefined;
    title?: string | undefined;
    translate?: "yes" | "no" | undefined;

    // Unknown
    radioGroup?: string | undefined; // <command>, <menuitem>

    // WAI-ARIA
    role?: AriaRole | undefined;

    // RDFa Attributes
    about?: string | undefined;
    content?: string | undefined;
    datatype?: string | undefined;
    inlist?: any;
    prefix?: string | undefined;
    property?: string | undefined;
    rel?: string | undefined;
    resource?: string | undefined;
    rev?: string | undefined;
    typeof?: string | undefined;
    vocab?: string | undefined;

    // Non-standard Attributes
    autoCorrect?: string | undefined;
    autoSave?: string | undefined;
    color?: string | undefined;
    itemProp?: string | undefined;
    itemScope?: boolean | undefined;
    itemType?: string | undefined;
    itemID?: string | undefined;
    itemRef?: string | undefined;
    results?: number | undefined;
    security?: string | undefined;
    unselectable?: "on" | "off" | undefined;

    // Living Standard
    /**
     * Hints at the type of data that might be entered by the user while editing the element or its contents
     * @see {@link https://html.spec.whatwg.org/multipage/interaction.html#input-modalities:-the-inputmode-attribute}
     */
    inputMode?:
      | "none"
      | "text"
      | "tel"
      | "url"
      | "email"
      | "numeric"
      | "decimal"
      | "search"
      | undefined;
    /**
     * Specify that a standard HTML element should behave like a defined custom built-in element
     * @see {@link https://html.spec.whatwg.org/multipage/custom-elements.html#attr-is}
     */
    is?: string | undefined;
  };

  export type AnchorHTMLAttributes = HTMLAttributes & {
    download?: any;
    href?: string | undefined;
    hrefLang?: string | undefined;
    media?: string | undefined;
    ping?: string | undefined;
    target?: HTMLAttributeAnchorTarget | undefined;
    type?: string | undefined;
    referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
  };

  export type AreaHTMLAttributes = HTMLAttributes & {
    alt?: string | undefined;
    coords?: string | undefined;
    download?: any;
    href?: string | undefined;
    hrefLang?: string | undefined;
    media?: string | undefined;
    referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
    shape?: string | undefined;
    target?: string | undefined;
  };

  export type MediaHTMLAttributes = HTMLAttributes & {
    autoPlay?: boolean | undefined;
    controls?: boolean | undefined;
    controlsList?: string | undefined;
    crossOrigin?: CrossOrigin;
    loop?: boolean | undefined;
    mediaGroup?: string | undefined;
    muted?: boolean | undefined;
    playsInline?: boolean | undefined;
    preload?: string | undefined;
    src?: string | undefined;
  };

  export type BaseHTMLAttributes = HTMLAttributes & {
    href?: string | undefined;
    target?: string | undefined;
  };

  export type BlockquoteHTMLAttributes = HTMLAttributes & {
    cite?: string | undefined;
  };

  export type ButtonHTMLAttributes = HTMLAttributes & {
    disabled?: boolean | undefined;
    form?: string | undefined;
    formAction?: string;
    formEncType?: string | undefined;
    formMethod?: string | undefined;
    formNoValidate?: boolean | undefined;
    formTarget?: string | undefined;
    name?: string | undefined;
    type?: "submit" | "reset" | "button" | undefined;
    value?: string | readonly string[] | number | undefined;
  };

  export type CanvasHTMLAttributes = HTMLAttributes & {
    height?: number | string | undefined;
    width?: number | string | undefined;
  };

  export type ColHTMLAttributes = HTMLAttributes & {
    span?: number | undefined;
    width?: number | string | undefined;
  };

  export type ColgroupHTMLAttributes = HTMLAttributes & {
    span?: number | undefined;
  };

  export type DataHTMLAttributes = HTMLAttributes & {
    value?: string | readonly string[] | number | undefined;
  };

  export type DelHTMLAttributes = HTMLAttributes & {
    cite?: string | undefined;
    dateTime?: string | undefined;
  };

  export type DetailsHTMLAttributes = HTMLAttributes & {
    open?: boolean | undefined;
    onToggle?: EventHandler | undefined;
    name?: string | undefined;
  };

  export type DialogHTMLAttributes = HTMLAttributes & {
    onCancel?: EventHandler | undefined;
    onClose?: EventHandler | undefined;
    open?: boolean | undefined;
  };

  export type EmbedHTMLAttributes = HTMLAttributes & {
    height?: number | string | undefined;
    src?: string | undefined;
    type?: string | undefined;
    width?: number | string | undefined;
  };

  export type FieldsetHTMLAttributes = HTMLAttributes & {
    disabled?: boolean | undefined;
    form?: string | undefined;
    name?: string | undefined;
  };

  export type FormHTMLAttributes = HTMLAttributes & {
    acceptCharset?: string | undefined;
    action?: string | undefined;
    autoComplete?: string | undefined;
    encType?: string | undefined;
    method?: string | undefined;
    name?: string | undefined;
    noValidate?: boolean | undefined;
    target?: string | undefined;
  };

  export type HtmlHTMLAttributes = HTMLAttributes & {
    manifest?: string | undefined;
  };

  export type IframeHTMLAttributes = HTMLAttributes & {
    allow?: string | undefined;
    allowFullScreen?: boolean | undefined;
    allowTransparency?: boolean | undefined;
    /** @deprecated */
    frameBorder?: number | string | undefined;
    height?: number | string | undefined;
    loading?: "eager" | "lazy" | undefined;
    /** @deprecated */
    marginHeight?: number | undefined;
    /** @deprecated */
    marginWidth?: number | undefined;
    name?: string | undefined;
    referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
    sandbox?: string | undefined;
    /** @deprecated */
    scrolling?: string | undefined;
    seamless?: boolean | undefined;
    src?: string | undefined;
    srcDoc?: string | undefined;
    width?: number | string | undefined;
  };

  export type ImgHTMLAttributes = HTMLAttributes & {
    alt?: string | undefined;
    crossOrigin?: CrossOrigin;
    decoding?: "async" | "auto" | "sync" | undefined;
    fetchPriority?: "high" | "low" | "auto";
    height?: number | string | undefined;
    loading?: "eager" | "lazy" | undefined;
    referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
    sizes?: string | undefined;
    src?: string | undefined;
    srcSet?: string | undefined;
    useMap?: string | undefined;
    width?: number | string | undefined;
  };

  type HTMLInputTypeAttribute =
    | "button"
    | "checkbox"
    | "color"
    | "date"
    | "datetime-local"
    | "email"
    | "file"
    | "hidden"
    | "image"
    | "month"
    | "number"
    | "password"
    | "radio"
    | "range"
    | "reset"
    | "search"
    | "submit"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week"
    | (string & {});

  type AutoFillAddressKind = "billing" | "shipping";
  type AutoFillBase = "" | "off" | "on";
  type AutoFillContactField =
    | "email"
    | "tel"
    | "tel-area-code"
    | "tel-country-code"
    | "tel-extension"
    | "tel-local"
    | "tel-local-prefix"
    | "tel-local-suffix"
    | "tel-national";
  type AutoFillContactKind = "home" | "mobile" | "work";
  type AutoFillCredentialField = "webauthn";
  type AutoFillNormalField =
    | "additional-name"
    | "address-level1"
    | "address-level2"
    | "address-level3"
    | "address-level4"
    | "address-line1"
    | "address-line2"
    | "address-line3"
    | "bday-day"
    | "bday-month"
    | "bday-year"
    | "cc-csc"
    | "cc-exp"
    | "cc-exp-month"
    | "cc-exp-year"
    | "cc-family-name"
    | "cc-given-name"
    | "cc-name"
    | "cc-number"
    | "cc-type"
    | "country"
    | "country-name"
    | "current-password"
    | "family-name"
    | "given-name"
    | "honorific-prefix"
    | "honorific-suffix"
    | "name"
    | "new-password"
    | "one-time-code"
    | "organization"
    | "postal-code"
    | "street-address"
    | "transaction-amount"
    | "transaction-currency"
    | "username";
  type OptionalPrefixToken<T extends string> = `${T} ` | "";
  type OptionalPostfixToken<T extends string> = ` ${T}` | "";
  type AutoFillField =
    | AutoFillNormalField
    | `${OptionalPrefixToken<AutoFillContactKind>}${AutoFillContactField}`;
  type AutoFillSection = `section-${string}`;
  type AutoFill =
    | AutoFillBase
    | `${OptionalPrefixToken<AutoFillSection>}${OptionalPrefixToken<AutoFillAddressKind>}${AutoFillField}${OptionalPostfixToken<AutoFillCredentialField>}`;
  type HTMLInputAutoCompleteAttribute = AutoFill | (string & {});

  export type InputHTMLAttributes = HTMLAttributes & {
    accept?: string | undefined;
    alt?: string | undefined;
    autoComplete?: HTMLInputAutoCompleteAttribute | undefined;
    capture?: boolean | "user" | "environment" | undefined; // https://www.w3.org/TR/html-media-capture/#the-capture-attribute
    checked?: boolean | undefined;
    disabled?: boolean | undefined;
    form?: string | undefined;
    formAction?: string | undefined;
    formEncType?: string | undefined;
    formMethod?: string | undefined;
    formNoValidate?: boolean | undefined;
    formTarget?: string | undefined;
    height?: number | string | undefined;
    list?: string | undefined;
    max?: number | string | undefined;
    maxLength?: number | undefined;
    min?: number | string | undefined;
    minLength?: number | undefined;
    multiple?: boolean | undefined;
    name?: string | undefined;
    pattern?: string | undefined;
    placeholder?: string | undefined;
    readOnly?: boolean | undefined;
    required?: boolean | undefined;
    size?: number | undefined;
    src?: string | undefined;
    step?: number | string | undefined;
    type?: HTMLInputTypeAttribute | undefined;
    value?: string | readonly string[] | number | undefined;
    width?: number | string | undefined;
  };

  export type InsHTMLAttributes = HTMLAttributes & {
    cite?: string | undefined;
    dateTime?: string | undefined;
  };

  export type KeygenHTMLAttributes = HTMLAttributes & {
    challenge?: string | undefined;
    disabled?: boolean | undefined;
    form?: string | undefined;
    keyType?: string | undefined;
    keyParams?: string | undefined;
    name?: string | undefined;
  };

  export type LabelHTMLAttributes = HTMLAttributes & {
    form?: string | undefined;
    htmlFor?: string | undefined;
  };

  export type LiHTMLAttributes = HTMLAttributes & {
    value?: string | readonly string[] | number | undefined;
  };

  export type LinkHTMLAttributes = HTMLAttributes & {
    as?: string | undefined;
    crossOrigin?: CrossOrigin;
    fetchPriority?: "high" | "low" | "auto";
    href?: string | undefined;
    hrefLang?: string | undefined;
    integrity?: string | undefined;
    media?: string | undefined;
    imageSrcSet?: string | undefined;
    imageSizes?: string | undefined;
    referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
    sizes?: string | undefined;
    type?: string | undefined;
    charSet?: string | undefined;
  };

  export type MapHTMLAttributes = HTMLAttributes & {
    name?: string | undefined;
  };

  export type MenuHTMLAttributes = HTMLAttributes & {
    type?: string | undefined;
  };

  export type MetaHTMLAttributes = HTMLAttributes & {
    charSet?: string | undefined;
    content?: string | undefined;
    httpEquiv?: string | undefined;
    media?: string | undefined;
    name?: string | undefined;
  };

  export type MeterHTMLAttributes = HTMLAttributes & {
    form?: string | undefined;
    high?: number | undefined;
    low?: number | undefined;
    max?: number | string | undefined;
    min?: number | string | undefined;
    optimum?: number | undefined;
    value?: string | readonly string[] | number | undefined;
  };

  export type ObjectHTMLAttributes = HTMLAttributes & {
    classID?: string | undefined;
    data?: string | undefined;
    form?: string | undefined;
    height?: number | string | undefined;
    name?: string | undefined;
    type?: string | undefined;
    useMap?: string | undefined;
    width?: number | string | undefined;
    wmode?: string | undefined;
  };

  export type OlHTMLAttributes = HTMLAttributes & {
    reversed?: boolean | undefined;
    start?: number | undefined;
    type?: "1" | "a" | "A" | "i" | "I" | undefined;
  };

  export type OptgroupHTMLAttributes = HTMLAttributes & {
    disabled?: boolean | undefined;
    label?: string | undefined;
  };

  export type OptionHTMLAttributes = HTMLAttributes & {
    disabled?: boolean | undefined;
    label?: string | undefined;
    selected?: boolean | undefined;
    value?: string | readonly string[] | number | undefined;
  };

  export type OutputHTMLAttributes = HTMLAttributes & {
    form?: string | undefined;
    htmlFor?: string | undefined;
    name?: string | undefined;
  };

  export type ParamHTMLAttributes = HTMLAttributes & {
    name?: string | undefined;
    value?: string | readonly string[] | number | undefined;
  };

  export type ProgressHTMLAttributes = HTMLAttributes & {
    max?: number | string | undefined;
    value?: string | readonly string[] | number | undefined;
  };

  export type QuoteHTMLAttributes = HTMLAttributes & {
    cite?: string | undefined;
  };

  export type SlotHTMLAttributes = HTMLAttributes & {
    name?: string | undefined;
  };

  export type ScriptHTMLAttributes = HTMLAttributes & {
    async?: boolean | undefined;
    /** @deprecated */
    charSet?: string | undefined;
    crossOrigin?: CrossOrigin;
    defer?: boolean | undefined;
    integrity?: string | undefined;
    noModule?: boolean | undefined;
    nonce?: string | undefined;
    referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
    src?: string | undefined;
    type?: string | undefined;
  };

  export type SelectHTMLAttributes = HTMLAttributes & {
    autoComplete?: string | undefined;
    disabled?: boolean | undefined;
    form?: string | undefined;
    multiple?: boolean | undefined;
    name?: string | undefined;
    required?: boolean | undefined;
    size?: number | undefined;
    value?: string | readonly string[] | number | undefined;
    onChange?: EventHandler<HTMLSelectElement> | undefined;
  };

  export type SourceHTMLAttributes = HTMLAttributes & {
    height?: number | string | undefined;
    media?: string | undefined;
    sizes?: string | undefined;
    src?: string | undefined;
    srcSet?: string | undefined;
    type?: string | undefined;
    width?: number | string | undefined;
  };

  export type StyleHTMLAttributes = HTMLAttributes & {
    media?: string | undefined;
    scoped?: boolean | undefined;
    type?: string | undefined;
  };

  export type TableHTMLAttributes = HTMLAttributes & {
    align?: "left" | "center" | "right" | undefined;
    bgcolor?: string | undefined;
    border?: number | undefined;
    cellPadding?: number | string | undefined;
    cellSpacing?: number | string | undefined;
    frame?: boolean | undefined;
    rules?: "none" | "groups" | "rows" | "columns" | "all" | undefined;
    summary?: string | undefined;
    width?: number | string | undefined;
  };

  export type TdHTMLAttributes = HTMLAttributes & {
    align?: "left" | "center" | "right" | "justify" | "char" | undefined;
    colSpan?: number | undefined;
    headers?: string | undefined;
    rowSpan?: number | undefined;
    scope?: string | undefined;
    abbr?: string | undefined;
    height?: number | string | undefined;
    width?: number | string | undefined;
    valign?: "top" | "middle" | "bottom" | "baseline" | undefined;
  };

  export type TextareaHTMLAttributes = HTMLAttributes & {
    autoComplete?: string | undefined;
    cols?: number | undefined;
    dirName?: string | undefined;
    disabled?: boolean | undefined;
    form?: string | undefined;
    maxLength?: number | undefined;
    minLength?: number | undefined;
    name?: string | undefined;
    placeholder?: string | undefined;
    readOnly?: boolean | undefined;
    required?: boolean | undefined;
    rows?: number | undefined;
    value?: string | readonly string[] | number | undefined;
    wrap?: string | undefined;

    onChange?: EventHandler<HTMLTextAreaElement> | undefined;
  };

  export type ThHTMLAttributes = HTMLAttributes & {
    align?: "left" | "center" | "right" | "justify" | "char" | undefined;
    colSpan?: number | undefined;
    headers?: string | undefined;
    rowSpan?: number | undefined;
    scope?: string | undefined;
    abbr?: string | undefined;
  };

  export type TimeHTMLAttributes = HTMLAttributes & {
    dateTime?: string | undefined;
  };

  export type TrackHTMLAttributes = HTMLAttributes & {
    default?: boolean | undefined;
    kind?: string | undefined;
    label?: string | undefined;
    src?: string | undefined;
    srcLang?: string | undefined;
  };

  export type VideoHTMLAttributes = MediaHTMLAttributes & {
    height?: number | string | undefined;
    playsInline?: boolean | undefined;
    poster?: string | undefined;
    width?: number | string | undefined;
    disablePictureInPicture?: boolean | undefined;
    disableRemotePlayback?: boolean | undefined;
  };

  export type WebViewHTMLAttributes = HTMLAttributes & {
    allowFullScreen?: boolean | undefined;
    allowpopups?: boolean | undefined;
    autosize?: boolean | undefined;
    blinkfeatures?: string | undefined;
    disableblinkfeatures?: string | undefined;
    disableguestresize?: boolean | undefined;
    disablewebsecurity?: boolean | undefined;
    guestinstance?: string | undefined;
    httpreferrer?: string | undefined;
    nodeintegration?: boolean | undefined;
    partition?: string | undefined;
    plugins?: boolean | undefined;
    preload?: string | undefined;
    src?: string | undefined;
    useragent?: string | undefined;
    webpreferences?: string | undefined;
  };

  export type HTMLElementProps<
    A = HTMLAttributes,
    E extends NativeElement = Element
  > = AriaAttributes & { children?: any | any[] } & DOMEventHandlers<E> & A;

  export type SVGAttributes = {
    // Attributes which also defined in HTMLAttributes
    // See comment in SVGDOMPropertyConfig.js
    className?: string | undefined;
    color?: string | undefined;
    height?: number | string | undefined;
    id?: string | undefined;
    lang?: string | undefined;
    max?: number | string | undefined;
    media?: string | undefined;
    method?: string | undefined;
    min?: number | string | undefined;
    name?: string | undefined;
    style?: CSS.Properties | undefined;
    target?: string | undefined;
    type?: string | undefined;
    width?: number | string | undefined;

    // Other HTML properties supported by SVG elements in browsers
    role?: AriaRole | undefined;
    tabIndex?: number | undefined;
    crossOrigin?: CrossOrigin;

    // SVG Specific attributes
    accentHeight?: number | string | undefined;
    accumulate?: "none" | "sum" | undefined;
    additive?: "replace" | "sum" | undefined;
    alignmentBaseline?:
      | "auto"
      | "baseline"
      | "before-edge"
      | "text-before-edge"
      | "middle"
      | "central"
      | "after-edge"
      | "text-after-edge"
      | "ideographic"
      | "alphabetic"
      | "hanging"
      | "mathematical"
      | "inherit"
      | undefined;
    allowReorder?: "no" | "yes" | undefined;
    alphabetic?: number | string | undefined;
    amplitude?: number | string | undefined;
    arabicForm?: "initial" | "medial" | "terminal" | "isolated" | undefined;
    ascent?: number | string | undefined;
    attributeName?: string | undefined;
    attributeType?: string | undefined;
    autoReverse?: Booleanish | undefined;
    azimuth?: number | string | undefined;
    baseFrequency?: number | string | undefined;
    baselineShift?: number | string | undefined;
    baseProfile?: number | string | undefined;
    bbox?: number | string | undefined;
    begin?: number | string | undefined;
    bias?: number | string | undefined;
    by?: number | string | undefined;
    calcMode?: number | string | undefined;
    capHeight?: number | string | undefined;
    clip?: number | string | undefined;
    clipPath?: string | undefined;
    clipPathUnits?: number | string | undefined;
    clipRule?: number | string | undefined;
    colorInterpolation?: number | string | undefined;
    colorInterpolationFilters?:
      | "auto"
      | "sRGB"
      | "linearRGB"
      | "inherit"
      | undefined;
    colorProfile?: number | string | undefined;
    colorRendering?: number | string | undefined;
    contentScriptType?: number | string | undefined;
    contentStyleType?: number | string | undefined;
    cursor?: number | string | undefined;
    cx?: number | string | undefined;
    cy?: number | string | undefined;
    d?: string | undefined;
    decelerate?: number | string | undefined;
    descent?: number | string | undefined;
    diffuseConstant?: number | string | undefined;
    direction?: number | string | undefined;
    display?: number | string | undefined;
    divisor?: number | string | undefined;
    dominantBaseline?: number | string | undefined;
    dur?: number | string | undefined;
    dx?: number | string | undefined;
    dy?: number | string | undefined;
    edgeMode?: number | string | undefined;
    elevation?: number | string | undefined;
    enableBackground?: number | string | undefined;
    end?: number | string | undefined;
    exponent?: number | string | undefined;
    externalResourcesRequired?: Booleanish | undefined;
    fill?: string | undefined;
    fillOpacity?: number | string | undefined;
    fillRule?: "nonzero" | "evenodd" | "inherit" | undefined;
    filter?: string | undefined;
    filterRes?: number | string | undefined;
    filterUnits?: number | string | undefined;
    floodColor?: number | string | undefined;
    floodOpacity?: number | string | undefined;
    focusable?: Booleanish | "auto" | undefined;
    fontFamily?: string | undefined;
    fontSize?: number | string | undefined;
    fontSizeAdjust?: number | string | undefined;
    fontStretch?: number | string | undefined;
    fontStyle?: number | string | undefined;
    fontVariant?: number | string | undefined;
    fontWeight?: number | string | undefined;
    format?: number | string | undefined;
    fr?: number | string | undefined;
    from?: number | string | undefined;
    fx?: number | string | undefined;
    fy?: number | string | undefined;
    g1?: number | string | undefined;
    g2?: number | string | undefined;
    glyphName?: number | string | undefined;
    glyphOrientationHorizontal?: number | string | undefined;
    glyphOrientationVertical?: number | string | undefined;
    glyphRef?: number | string | undefined;
    gradientTransform?: string | undefined;
    gradientUnits?: string | undefined;
    hanging?: number | string | undefined;
    horizAdvX?: number | string | undefined;
    horizOriginX?: number | string | undefined;
    href?: string | undefined;
    ideographic?: number | string | undefined;
    imageRendering?: number | string | undefined;
    in2?: number | string | undefined;
    in?: string | undefined;
    intercept?: number | string | undefined;
    k1?: number | string | undefined;
    k2?: number | string | undefined;
    k3?: number | string | undefined;
    k4?: number | string | undefined;
    k?: number | string | undefined;
    kernelMatrix?: number | string | undefined;
    kernelUnitLength?: number | string | undefined;
    kerning?: number | string | undefined;
    keyPoints?: number | string | undefined;
    keySplines?: number | string | undefined;
    keyTimes?: number | string | undefined;
    lengthAdjust?: number | string | undefined;
    letterSpacing?: number | string | undefined;
    lightingColor?: number | string | undefined;
    limitingConeAngle?: number | string | undefined;
    local?: number | string | undefined;
    markerEnd?: string | undefined;
    markerHeight?: number | string | undefined;
    markerMid?: string | undefined;
    markerStart?: string | undefined;
    markerUnits?: number | string | undefined;
    markerWidth?: number | string | undefined;
    mask?: string | undefined;
    maskContentUnits?: number | string | undefined;
    maskUnits?: number | string | undefined;
    mathematical?: number | string | undefined;
    mode?: number | string | undefined;
    numOctaves?: number | string | undefined;
    offset?: number | string | undefined;
    opacity?: number | string | undefined;
    operator?: number | string | undefined;
    order?: number | string | undefined;
    orient?: number | string | undefined;
    orientation?: number | string | undefined;
    origin?: number | string | undefined;
    overflow?: number | string | undefined;
    overlinePosition?: number | string | undefined;
    overlineThickness?: number | string | undefined;
    paintOrder?: number | string | undefined;
    panose1?: number | string | undefined;
    path?: string | undefined;
    pathLength?: number | string | undefined;
    patternContentUnits?: string | undefined;
    patternTransform?: number | string | undefined;
    patternUnits?: string | undefined;
    pointerEvents?: number | string | undefined;
    points?: string | undefined;
    pointsAtX?: number | string | undefined;
    pointsAtY?: number | string | undefined;
    pointsAtZ?: number | string | undefined;
    preserveAlpha?: Booleanish | undefined;
    preserveAspectRatio?: string | undefined;
    primitiveUnits?: number | string | undefined;
    r?: number | string | undefined;
    radius?: number | string | undefined;
    refX?: number | string | undefined;
    refY?: number | string | undefined;
    renderingIntent?: number | string | undefined;
    repeatCount?: number | string | undefined;
    repeatDur?: number | string | undefined;
    requiredExtensions?: number | string | undefined;
    requiredFeatures?: number | string | undefined;
    restart?: number | string | undefined;
    result?: string | undefined;
    rotate?: number | string | undefined;
    rx?: number | string | undefined;
    ry?: number | string | undefined;
    scale?: number | string | undefined;
    seed?: number | string | undefined;
    shapeRendering?: number | string | undefined;
    slope?: number | string | undefined;
    spacing?: number | string | undefined;
    specularConstant?: number | string | undefined;
    specularExponent?: number | string | undefined;
    speed?: number | string | undefined;
    spreadMethod?: string | undefined;
    startOffset?: number | string | undefined;
    stdDeviation?: number | string | undefined;
    stemh?: number | string | undefined;
    stemv?: number | string | undefined;
    stitchTiles?: number | string | undefined;
    stopColor?: string | undefined;
    stopOpacity?: number | string | undefined;
    strikethroughPosition?: number | string | undefined;
    strikethroughThickness?: number | string | undefined;
    string?: number | string | undefined;
    stroke?: string | undefined;
    strokeDasharray?: string | number | undefined;
    strokeDashoffset?: string | number | undefined;
    strokeLinecap?: "butt" | "round" | "square" | "inherit" | undefined;
    strokeLinejoin?: "miter" | "round" | "bevel" | "inherit" | undefined;
    strokeMiterlimit?: number | string | undefined;
    strokeOpacity?: number | string | undefined;
    strokeWidth?: number | string | undefined;
    surfaceScale?: number | string | undefined;
    systemLanguage?: number | string | undefined;
    tableValues?: number | string | undefined;
    targetX?: number | string | undefined;
    targetY?: number | string | undefined;
    textAnchor?: string | undefined;
    textDecoration?: number | string | undefined;
    textLength?: number | string | undefined;
    textRendering?: number | string | undefined;
    to?: number | string | undefined;
    transform?: string | undefined;
    u1?: number | string | undefined;
    u2?: number | string | undefined;
    underlinePosition?: number | string | undefined;
    underlineThickness?: number | string | undefined;
    unicode?: number | string | undefined;
    unicodeBidi?: number | string | undefined;
    unicodeRange?: number | string | undefined;
    unitsPerEm?: number | string | undefined;
    vAlphabetic?: number | string | undefined;
    values?: string | undefined;
    vectorEffect?: number | string | undefined;
    version?: string | undefined;
    vertAdvY?: number | string | undefined;
    vertOriginX?: number | string | undefined;
    vertOriginY?: number | string | undefined;
    vHanging?: number | string | undefined;
    vIdeographic?: number | string | undefined;
    viewBox?: string | undefined;
    viewTarget?: number | string | undefined;
    visibility?: number | string | undefined;
    vMathematical?: number | string | undefined;
    widths?: number | string | undefined;
    wordSpacing?: number | string | undefined;
    writingMode?: number | string | undefined;
    x1?: number | string | undefined;
    x2?: number | string | undefined;
    x?: number | string | undefined;
    xChannelSelector?: string | undefined;
    xHeight?: number | string | undefined;
    xlinkActuate?: string | undefined;
    xlinkArcrole?: string | undefined;
    xlinkHref?: string | undefined;
    xlinkRole?: string | undefined;
    xlinkShow?: string | undefined;
    xlinkTitle?: string | undefined;
    xlinkType?: string | undefined;
    xmlBase?: string | undefined;
    xmlLang?: string | undefined;
    xmlns?: string | undefined;
    xmlnsXlink?: string | undefined;
    xmlSpace?: string | undefined;
    y1?: number | string | undefined;
    y2?: number | string | undefined;
    y?: number | string | undefined;
    yChannelSelector?: string | undefined;
    z?: number | string | undefined;
    zoomAndPan?: string | undefined;
  };

  export type SVGElementProps<E extends NativeElement = SVGElement> =
    AriaAttributes & DOMEventHandlers<E> & SVGAttributes;
}

declare global {
  namespace JSX {
    interface Element extends PaltaElement {}

    interface ElementAttributesProperty {
      props: {};
    }

    interface ElementChildrenAttribute {
      children: {};
    }

    interface IntrinsicElements {
      // HTML
      a: Palta.HTMLElementProps<Palta.AnchorHTMLAttributes, HTMLAnchorElement>;
      abbr: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      address: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      area: Palta.HTMLElementProps<Palta.AreaHTMLAttributes, HTMLAreaElement>;
      article: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      aside: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      audio: Palta.HTMLElementProps<
        Palta.MediaHTMLAttributes,
        HTMLAudioElement
      >;
      b: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      base: Palta.HTMLElementProps<Palta.BaseHTMLAttributes, HTMLBaseElement>;
      bdi: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      bdo: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      big: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      blockquote: Palta.HTMLElementProps<
        Palta.BlockquoteHTMLAttributes,
        HTMLQuoteElement
      >;
      body: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLBodyElement>;
      br: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLBRElement>;
      button: Palta.HTMLElementProps<
        Palta.ButtonHTMLAttributes,
        HTMLButtonElement
      >;
      canvas: Palta.HTMLElementProps<
        Palta.CanvasHTMLAttributes,
        HTMLCanvasElement
      >;
      caption: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      center: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      cite: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      code: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      col: Palta.HTMLElementProps<Palta.ColHTMLAttributes, HTMLTableColElement>;
      colgroup: Palta.HTMLElementProps<
        Palta.ColgroupHTMLAttributes,
        HTMLTableColElement
      >;
      data: Palta.HTMLElementProps<Palta.DataHTMLAttributes, HTMLDataElement>;
      datalist: Palta.HTMLElementProps<
        Palta.HTMLAttributes,
        HTMLDataListElement
      >;
      dd: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      del: Palta.HTMLElementProps<Palta.DelHTMLAttributes, HTMLModElement>;
      details: Palta.HTMLElementProps<
        Palta.DetailsHTMLAttributes,
        HTMLDetailsElement
      >;
      dfn: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      dialog: Palta.HTMLElementProps<
        Palta.DialogHTMLAttributes,
        HTMLDialogElement
      >;
      div: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLDivElement>;
      dl: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLDListElement>;
      dt: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      em: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      embed: Palta.HTMLElementProps<
        Palta.EmbedHTMLAttributes,
        HTMLEmbedElement
      >;
      fieldset: Palta.HTMLElementProps<
        Palta.FieldsetHTMLAttributes,
        HTMLFieldSetElement
      >;
      figcaption: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      figure: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      footer: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      form: Palta.HTMLElementProps<Palta.FormHTMLAttributes, HTMLFormElement>;
      h1: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLHeadingElement>;
      h2: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLHeadingElement>;
      h3: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLHeadingElement>;
      h4: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLHeadingElement>;
      h5: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLHeadingElement>;
      h6: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLHeadingElement>;
      head: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLHeadElement>;
      header: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      hgroup: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      hr: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLHRElement>;
      html: Palta.HTMLElementProps<Palta.HtmlHTMLAttributes, HTMLHtmlElement>;
      i: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      iframe: Palta.HTMLElementProps<
        Palta.IframeHTMLAttributes,
        HTMLIFrameElement
      >;
      img: Palta.HTMLElementProps<Palta.ImgHTMLAttributes, HTMLImageElement>;
      input: Palta.HTMLElementProps<
        Palta.InputHTMLAttributes,
        HTMLInputElement
      >;
      ins: Palta.HTMLElementProps<Palta.InsHTMLAttributes, HTMLModElement>;
      kbd: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      keygen: Palta.HTMLElementProps<Palta.KeygenHTMLAttributes, HTMLElement>;
      label: Palta.HTMLElementProps<
        Palta.LabelHTMLAttributes,
        HTMLLabelElement
      >;
      legend: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLLegendElement>;
      li: Palta.HTMLElementProps<Palta.LiHTMLAttributes, HTMLLIElement>;
      link: Palta.HTMLElementProps<Palta.LinkHTMLAttributes, HTMLLinkElement>;
      main: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      map: Palta.HTMLElementProps<Palta.MapHTMLAttributes, HTMLMapElement>;
      mark: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      menu: Palta.HTMLElementProps<Palta.MenuHTMLAttributes, HTMLElement>;
      menuitem: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      meta: Palta.HTMLElementProps<Palta.MetaHTMLAttributes, HTMLMetaElement>;
      meter: Palta.HTMLElementProps<
        Palta.MeterHTMLAttributes,
        HTMLMeterElement
      >;
      nav: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      noindex: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      noscript: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      object: Palta.HTMLElementProps<
        Palta.ObjectHTMLAttributes,
        HTMLObjectElement
      >;
      ol: Palta.HTMLElementProps<Palta.OlHTMLAttributes, HTMLOListElement>;
      optgroup: Palta.HTMLElementProps<
        Palta.OptgroupHTMLAttributes,
        HTMLOptGroupElement
      >;
      option: Palta.HTMLElementProps<
        Palta.OptionHTMLAttributes,
        HTMLOptionElement
      >;
      output: Palta.HTMLElementProps<
        Palta.OutputHTMLAttributes,
        HTMLOutputElement
      >;
      p: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLParagraphElement>;
      param: Palta.HTMLElementProps<
        Palta.ParamHTMLAttributes,
        HTMLParamElement
      >;
      picture: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      pre: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLPreElement>;
      progress: Palta.HTMLElementProps<
        Palta.ProgressHTMLAttributes,
        HTMLProgressElement
      >;
      q: Palta.HTMLElementProps<Palta.QuoteHTMLAttributes, HTMLQuoteElement>;
      rp: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      rt: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      ruby: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      s: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      samp: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      search: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      slot: Palta.HTMLElementProps<Palta.SlotHTMLAttributes, HTMLSlotElement>;
      script: Palta.HTMLElementProps<
        Palta.ScriptHTMLAttributes,
        HTMLScriptElement
      >;
      section: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      select: Palta.HTMLElementProps<
        Palta.SelectHTMLAttributes,
        HTMLSelectElement
      >;
      small: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      source: Palta.HTMLElementProps<
        Palta.SourceHTMLAttributes,
        HTMLSourceElement
      >;
      span: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLSpanElement>;
      strong: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      style: Palta.HTMLElementProps<
        Palta.StyleHTMLAttributes,
        HTMLStyleElement
      >;
      sub: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      summary: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      sup: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      table: Palta.HTMLElementProps<
        Palta.TableHTMLAttributes,
        HTMLTableElement
      >;
      template: Palta.HTMLElementProps<
        Palta.HTMLAttributes,
        HTMLTemplateElement
      >;
      tbody: Palta.HTMLElementProps<
        Palta.HTMLAttributes,
        HTMLTableSectionElement
      >;
      td: Palta.HTMLElementProps<
        Palta.TdHTMLAttributes,
        HTMLTableDataCellElement
      >;
      textarea: Palta.HTMLElementProps<
        Palta.TextareaHTMLAttributes,
        HTMLTextAreaElement
      >;
      tfoot: Palta.HTMLElementProps<
        Palta.HTMLAttributes,
        HTMLTableSectionElement
      >;
      th: Palta.HTMLElementProps<
        Palta.ThHTMLAttributes,
        HTMLTableHeaderCellElement
      >;
      thead: Palta.HTMLElementProps<
        Palta.HTMLAttributes,
        HTMLTableSectionElement
      >;
      time: Palta.HTMLElementProps<Palta.TimeHTMLAttributes, HTMLTimeElement>;
      title: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLTitleElement>;
      tr: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLTableRowElement>;
      track: Palta.HTMLElementProps<
        Palta.TrackHTMLAttributes,
        HTMLTrackElement
      >;
      u: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      ul: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLUListElement>;
      var: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;
      video: Palta.HTMLElementProps<
        Palta.VideoHTMLAttributes,
        HTMLVideoElement
      >;
      wbr: Palta.HTMLElementProps<Palta.HTMLAttributes, HTMLElement>;

      // SVG
      svg: Palta.SVGElementProps<SVGSVGElement>;

      animate: Palta.SVGElementProps<SVGElement>;
      animateMotion: Palta.SVGElementProps<SVGElement>;
      animateTransform: Palta.SVGElementProps<SVGElement>;
      circle: Palta.SVGElementProps<SVGCircleElement>;
      clipPath: Palta.SVGElementProps<SVGClipPathElement>;
      defs: Palta.SVGElementProps<SVGDefsElement>;
      desc: Palta.SVGElementProps<SVGDescElement>;
      ellipse: Palta.SVGElementProps<SVGEllipseElement>;
      feBlend: Palta.SVGElementProps<SVGFEBlendElement>;
      feColorMatrix: Palta.SVGElementProps<SVGFEColorMatrixElement>;
      feComponentTransfer: Palta.SVGElementProps<SVGFEComponentTransferElement>;
      feComposite: Palta.SVGElementProps<SVGFECompositeElement>;
      feConvolveMatrix: Palta.SVGElementProps<SVGFEConvolveMatrixElement>;
      feDiffuseLighting: Palta.SVGElementProps<SVGFEDiffuseLightingElement>;
      feDisplacementMap: Palta.SVGElementProps<SVGFEDisplacementMapElement>;
      feDistantLight: Palta.SVGElementProps<SVGFEDistantLightElement>;
      feDropShadow: Palta.SVGElementProps<SVGFEDropShadowElement>;
      feFlood: Palta.SVGElementProps<SVGFEFloodElement>;
      feFuncA: Palta.SVGElementProps<SVGFEFuncAElement>;
      feFuncB: Palta.SVGElementProps<SVGFEFuncBElement>;
      feFuncG: Palta.SVGElementProps<SVGFEFuncGElement>;
      feFuncR: Palta.SVGElementProps<SVGFEFuncRElement>;
      feGaussianBlur: Palta.SVGElementProps<SVGFEGaussianBlurElement>;
      feImage: Palta.SVGElementProps<SVGFEImageElement>;
      feMerge: Palta.SVGElementProps<SVGFEMergeElement>;
      feMergeNode: Palta.SVGElementProps<SVGFEMergeNodeElement>;
      feMorphology: Palta.SVGElementProps<SVGFEMorphologyElement>;
      feOffset: Palta.SVGElementProps<SVGFEOffsetElement>;
      fePointLight: Palta.SVGElementProps<SVGFEPointLightElement>;
      feSpecularLighting: Palta.SVGElementProps<SVGFESpecularLightingElement>;
      feSpotLight: Palta.SVGElementProps<SVGFESpotLightElement>;
      feTile: Palta.SVGElementProps<SVGFETileElement>;
      feTurbulence: Palta.SVGElementProps<SVGFETurbulenceElement>;
      filter: Palta.SVGElementProps<SVGFilterElement>;
      foreignObject: Palta.SVGElementProps<SVGForeignObjectElement>;
      g: Palta.SVGElementProps<SVGGElement>;
      image: Palta.SVGElementProps<SVGImageElement>;
      line: Palta.SVGElementProps<SVGLineElement>;
      linearGradient: Palta.SVGElementProps<SVGLinearGradientElement>;
      marker: Palta.SVGElementProps<SVGMarkerElement>;
      mask: Palta.SVGElementProps<SVGMaskElement>;
      metadata: Palta.SVGElementProps<SVGMetadataElement>;
      mpath: Palta.SVGElementProps<SVGElement>;
      path: Palta.SVGElementProps<SVGPathElement>;
      pattern: Palta.SVGElementProps<SVGPatternElement>;
      polygon: Palta.SVGElementProps<SVGPolygonElement>;
      polyline: Palta.SVGElementProps<SVGPolylineElement>;
      radialGradient: Palta.SVGElementProps<SVGRadialGradientElement>;
      rect: Palta.SVGElementProps<SVGRectElement>;
      set: Palta.SVGElementProps<SVGSetElement>;
      stop: Palta.SVGElementProps<SVGStopElement>;
      switch: Palta.SVGElementProps<SVGSwitchElement>;
      symbol: Palta.SVGElementProps<SVGSymbolElement>;
      text: Palta.SVGElementProps<SVGTextElement>;
      textPath: Palta.SVGElementProps<SVGTextPathElement>;
      tspan: Palta.SVGElementProps<SVGTSpanElement>;
      use: Palta.SVGElementProps<SVGUseElement>;
      view: Palta.SVGElementProps<SVGViewElement>;
    }
  }
}

export type EventName = keyof Palta.DOMEventHandlers;
