import React, { ReactElement } from "react";
import { Instance } from "flatpickr/dist/types/instance";
import { Options, Plugin } from "flatpickr/dist/types/options";
import { CustomLocale, Locale } from "flatpickr/dist/types/locale";
export type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
export interface DateTimePickerProps extends Omit<React.ComponentPropsWithoutRef<"input">, "children" | "value" | "onChange"> {
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
    value?: string | Date | number | ReadonlyArray<string | Date | number> | undefined;
    className?: string | undefined;
    children?: React.ReactNode | undefined;
    render?: ((props: Omit<DateTimePickerProps, "options" | "render">, ref: (node: HTMLElement | null) => void, instance: Instance | null) => ReactElement) | undefined;
    onCreate?: (instance: Instance) => void;
    onDestroy?: (instance: Instance | null) => void;
}
declare const DateTimePicker: React.FC<DateTimePickerProps>;
export default DateTimePicker;
