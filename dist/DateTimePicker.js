var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useEffect, useCallback } from "react";
import flatpickr from "flatpickr";
const hooks = [
    "onChange",
    "onOpen",
    "onClose",
    "onMonthChange",
    "onYearChange",
    "onReady",
    "onValueUpdate",
    "onDayCreate",
];
const callbacks = ["onCreate", "onDestroy"];
const formatValue = (value, dateFormat) => {
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
const mergeHooks = (inputOptions, props) => {
    const options = Object.assign({}, inputOptions);
    hooks.forEach((hook) => {
        if (props[hook]) {
            if (options[hook] && !Array.isArray(options[hook])) {
                options[hook] = [options[hook]];
            }
            else if (!options[hook]) {
                options[hook] = [];
            }
            const propHook = Array.isArray(props[hook]) ? props[hook] : [props[hook]];
            options[hook].push(...propHook);
        }
    });
    return options;
};
const DateTimePicker = (_a) => {
    var { defaultValue = "", options = {}, value, children, className, render } = _a, props = __rest(_a, ["defaultValue", "options", "value", "children", "className", "render"]);
    const nodeRef = useRef(null);
    const flatpickrInstance = useRef(null);
    const createFlatpickrInstance = useCallback(() => {
        if (!nodeRef.current)
            return;
        let mergedOptions = Object.assign(Object.assign({ onClose: () => {
                if (nodeRef.current) {
                    nodeRef.current.blur();
                }
            } }, options), { locale: props.locale || options.locale, plugins: [...(options.plugins || []), ...(props.plugins || [])] });
        mergedOptions = mergeHooks(mergedOptions, props);
        flatpickrInstance.current = flatpickr(nodeRef.current, mergedOptions);
        if (value !== undefined) {
            const mutableValue = Array.isArray(value) ? [...value] : value;
            flatpickrInstance.current.setDate(mutableValue, false);
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
            const optionsKeys = Object.keys(mergedOptions);
            optionsKeys.forEach((key) => {
                let value = mergedOptions[key];
                // null check for flatpickrInstance.current and its config
                if (flatpickrInstance.current && flatpickrInstance.current.config) {
                    if (value !== flatpickrInstance.current.config[key]) {
                        if (Array.from(hooks).includes(key) &&
                            !Array.isArray(value)) {
                            if (value !== undefined) {
                                value = [value];
                            }
                        }
                        if (value !== undefined) {
                            flatpickrInstance.current.set(key, value);
                        }
                    }
                }
            });
            if (value !== undefined &&
                flatpickrInstance.current &&
                value !== flatpickrInstance.current.selectedDates) {
                const mutableValue = Array.isArray(value) ? [...value] : value;
                flatpickrInstance.current.setDate(mutableValue, false);
            }
        }
    }, [options, props, value]);
    const handleNodeChange = useCallback((node) => {
        nodeRef.current = node;
        if (flatpickrInstance.current) {
            destroyFlatpickrInstance();
            createFlatpickrInstance();
        }
    }, [createFlatpickrInstance, destroyFlatpickrInstance]);
    const filteredProps = Object.assign({}, props);
    hooks.forEach((hook) => delete filteredProps[hook]);
    callbacks.forEach((callback) => delete filteredProps[callback]);
    if (render) {
        return render(Object.assign(Object.assign({}, filteredProps), { defaultValue, value }), handleNodeChange, flatpickrInstance.current);
    }
    return (_jsx("input", Object.assign({}, filteredProps, { ref: handleNodeChange, className: className, defaultValue: defaultValue, value: value !== undefined ? formatValue(value, options.dateFormat) : undefined })));
};
export default DateTimePicker;
