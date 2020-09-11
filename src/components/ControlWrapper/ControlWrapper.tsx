import * as React from "react";
import { css } from "../../common/css";

export interface ControlWrapperProps {
    className?: string;
}

export function ControlWrapper(props: React.PropsWithChildren<ControlWrapperProps>) {
    return (
        <div className={css("sdpi-item", props.className)}>
            {props.children}
        </div>
    );
}
