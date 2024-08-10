import flatpickr from "flatpickr";
import { Instance } from "flatpickr/dist/types/instance";
import { CustomLocale, Locale } from "flatpickr/dist/types/locale";
import React, { useRef, useEffect, useCallback, ReactElement } from "react";
import { DateOption, Hook, Options, Plugin } from "flatpickr/dist/types/options";

type FlatpickrOptionValue =
  | Hook
  | HTMLElement
  | Element
  | Date
  | ((e: Error) => void)
  | ((date: Date, format: string, locale: Locale) => string)
  | ((date: Date) => string | number)
  | Partial<Options>
  | ((date: string, format: string) => Date)
  | ((self: Instance, customElement: HTMLElement | undefined) => void);

export type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

export interface DateTimePickerProps
  extends Omit<
    React.ComponentPropsWithoutRef<"input">,
    "children" | "value" | "onChange"
  > {
  defaultValue?: string | undefined;
  options?: Options | undefined;
  locale?: Locale | CustomLocale;
  plugins?: Plugin[];
  onChange?: Options["onChange"];
  onOpen?: Options["onOpen"];
  onClose?: Options["onClose"];
  onMonthChange?: Options["onMonthChange"];
  onYearChange?: Options["onYearChange"];
  onReady?: Options["onReady"];
  onValueUpdate?: Options["onValueUpdate"];
  onDayCreate?: Options["onDayCreate"];
  value?:
    | string
    | Date
    | number
    | ReadonlyArray<string | Date | number>
    | undefined;
  className?: string | undefined;
  children?: React.ReactNode | undefined;
  render?:
    | ((
    props: Omit<DateTimePickerProps, "options" | "render">,
    ref: (node: HTMLElement | null) => void,
    instance: Instance | null
  )  => ReactElement)
    | undefined;
  onCreate?: (instance: Instance) => void;
  onDestroy?: (instance: Instance | null) => void;
}

const hooks = [
  "onChange",
  "onOpen",
  "onClose",
  "onMonthChange",
  "onYearChange",
  "onReady",
  "onValueUpdate",
  "onDayCreate",
] as const;

const callbacks = ["onCreate", "onDestroy"] as const;

const formatValue = (value: string | Date | number | ReadonlyArray<string | Date | number>, dateFormat?: string): string => {
  if (Array.isArray(value)) {
    return value.map(v => formatValue(v, dateFormat)).join(', ');
  }
  if (value instanceof Date) {
    if (dateFormat) {
      return `${value.getFullYear()}.${String(value.getMonth() + 1).padStart(2, '0')}.${String(value.getDate()).padStart(2, '0')}`;
    }
    return value.toISOString().split('T')[0] || '';
  }
  if (typeof value === 'string') {
    if (dateFormat === 'Y.m.d') {
      return value.replace(/-/g, '.');
    }
    const dateRegex = /^(\d{4})\.(\d{2})\.(\d{2})$/;
    if (dateRegex.test(value)) {
      return value.replace(/\./g, '-');
    }
  }
  return String(value);
};

const mergeHooks = (
  inputOptions: Partial<Options>,
  props: DateTimePickerProps,
): Partial<Options> => {
  const options = { ...inputOptions };

  hooks.forEach((hook) => {
    if (props[hook]) {
      if (options[hook] && !Array.isArray(options[hook])) {
        options[hook] = [options[hook]];
      } else if (!options[hook]) {
        options[hook] = [];
      }

      const propHook = Array.isArray(props[hook]) ? props[hook] : [props[hook]];
      options[hook]!.push(...propHook);
    }
  });

  return options;
};

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  defaultValue = "",
  options = {},
  value,
  children,
  className,
  render,
  ...props
}) => {
  const nodeRef = useRef<HTMLInputElement | null>(null);
  const flatpickrInstance = useRef<Instance | null>(null);

  const createFlatpickrInstance = useCallback(() => {
    if (!nodeRef.current) return;

    let mergedOptions: Partial<Options> = {
      onClose: () => {
        if (nodeRef.current) {
          nodeRef.current.blur();
        }
      },
      ...options,
      locale: props.locale || options.locale,
      plugins: [...(options.plugins || []), ...(props.plugins || [])],
    };

    mergedOptions = mergeHooks(mergedOptions, props);

    flatpickrInstance.current = flatpickr(nodeRef.current, mergedOptions);

    if (value !== undefined) {
      const mutableValue = Array.isArray(value) ? [...value] : value;
      flatpickrInstance.current.setDate(mutableValue as DateOption | DateOption[], false);
    }
    if (props.onCreate) {
      props.onCreate(flatpickrInstance.current);
    }
  }, [options, props, value]);

  const destroyFlatpickrInstance = useCallback(() => {
    if (props.onDestroy && flatpickrInstance.current) {
      props.onDestroy(flatpickrInstance.current);
    }
    if (flatpickrInstance.current) {
      flatpickrInstance.current.destroy();
      flatpickrInstance.current = null;
    }
  }, [props]);

  useEffect(() => {
    createFlatpickrInstance();
    return () => {
      destroyFlatpickrInstance();
    };
  }, [createFlatpickrInstance, destroyFlatpickrInstance]);

  useEffect(() => {
    if (flatpickrInstance.current) {
      let mergedOptions = mergeHooks(options, props);
      const optionsKeys = Object.keys(mergedOptions) as (keyof Options)[];

      optionsKeys.forEach((key) => {
        let value = mergedOptions[key] as
          | FlatpickrOptionValue
          | FlatpickrOptionValue[];
        
        // null check for flatpickrInstance.current and its config
        if (flatpickrInstance.current && flatpickrInstance.current.config) {
          if (value !== flatpickrInstance.current.config[key]) {
            if (
              (Array.from(hooks) as string[]).includes(key as string) &&
              !Array.isArray(value)
            ) {
              if (value !== undefined) {
                value = [value];
              }
            }
            if (value !== undefined) {
              flatpickrInstance.current.set(key, value as any);
            }
          }
        }
      });

      if (
        value !== undefined &&
        flatpickrInstance.current &&
        value !== flatpickrInstance.current.selectedDates
      ) {
        const mutableValue = Array.isArray(value) ? [...value] : value;
        flatpickrInstance.current.setDate(mutableValue as DateOption | DateOption[], false);
      }
    }
  }, [options, props, value]);

  const handleNodeChange = useCallback(
  (node: HTMLElement | null) => {
    nodeRef.current = node as HTMLInputElement | null;
    if (flatpickrInstance.current) {
      destroyFlatpickrInstance();
      createFlatpickrInstance();
    }
  },
    [createFlatpickrInstance, destroyFlatpickrInstance],
  );

  const filteredProps = { ...props } as Record<string, any>;
  hooks.forEach((hook) => delete filteredProps[hook]);
  callbacks.forEach((callback) => delete filteredProps[callback]);

  if (render) {
    return render({ ...filteredProps, defaultValue, value }, handleNodeChange, flatpickrInstance.current);
  }

  return (
    <input
      {...filteredProps}
      ref={handleNodeChange}
      className={className}
      defaultValue={defaultValue}
      value={value !== undefined ? formatValue(value, options.dateFormat as string) : undefined}
    />
  );
};

export default DateTimePicker;
