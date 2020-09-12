import React, { CSSProperties } from "react";
import { getLogger } from "../../common/Logger";
import { ControlWrapper } from "../ControlWrapper/ControlWrapper";
import { Label } from "../Label/Label";

export interface DropDownOption<TPayload> {
    name: string;
    value: string;
    payload?: TPayload;
}

export interface DropDownProps<TPayload> {
    className?: string;
    style?: CSSProperties;
    label?: string;
    items?: DropDownOption<TPayload>[];
    disabled?: boolean;
    defaultValue?: string;

    onChange?: (selectedOption: DropDownOption<TPayload>) => void;
}

export function DropDown<TPayload>(props: DropDownProps<TPayload>) {
    const logger = getLogger("DropDown");
    const items = props.items ?? [];

    const onChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
        const newSelectedValue = ev.target.value;
        logger.info(`New value selected: ${newSelectedValue}`);

        if (props.onChange != null) {
            const selectedOption = props.items?.find(item => item.value === newSelectedValue);
            if (selectedOption != null) {
                props.onChange(selectedOption);
            } else {
                logger.error(`Could not find option with selected value "${newSelectedValue}"`);
            }
        }
    };

    const options = items.map((item, index) => <option key={`${item.value}-${index}`} value={item.value}>{item.name}</option>);
    return (
        <ControlWrapper>
            <Label>Device</Label>
            <select className="sdpi-item-value select" disabled={props.disabled} onChange={ev => onChange(ev)} defaultValue={props.defaultValue}>
                {options}
            </select>
        </ControlWrapper>
    );
}