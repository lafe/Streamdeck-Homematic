import * as React from "react";
import { getLogger } from "../../common/Logger";
import { ControlWrapper } from "../ControlWrapper/ControlWrapper";
import { Label } from "../Label/Label";

export interface NummericTextBoxProps {
    className?: string;
    label?: string;
    defaultValue?: number;
    placeholder?: string;
    disabled?: boolean;
    minValue?: number;
    maxValue?: number;

    onChange?: (newValue?: number) => void;
}

export function NummericTextBox(props: React.PropsWithChildren<NummericTextBoxProps>) {
    //const [value, setValue] = React.useState(props.defaultValue);
    const logger = getLogger("TextBox");

    const onChange = (newValue?: string) => {
        logger.log(`New value: ${newValue}`);
        const nummericValue = parseInt(newValue ?? "0");
        //setValue(newValue);
        if (props.onChange != null) {
            props.onChange(nummericValue);
        }
    };

    return (
        <ControlWrapper className={props.className}>
            <Label>{props.label}</Label>
            <input className="sdpi-item-value"
                type="number"
                defaultValue={props.defaultValue}
                placeholder={props.placeholder}
                disabled={props.disabled}
                min={props.minValue}
                max={props.maxValue}
                onInput={(ev) => onChange(ev.currentTarget.value)} />
        </ControlWrapper>
    );
}
