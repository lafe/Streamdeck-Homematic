import * as React from "react";
import { css } from "../../common/css";

export interface LabelProps {
    className?: string;
    text?: string;
}

export function Label (props: React.PropsWithChildren<LabelProps>) {
    return (
      <div className={css("sdpi-item-label", props.className)}>
          {props.text == null ? props.children : props.text}
      </div>
    );
}
