import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';

const PanelFormDialog = ({
    visible,
    panel,
    submitted,
    orientationOptions,
    typeOptions,
    onHide,
    onSave,
    onChange,
    onNumberChange,
    onDateChange,
    onDropdownChange
}) => {
    const panelDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={onHide} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={onSave} />
        </React.Fragment>
    );

    return (
        <Dialog 
            visible={visible} 
            style={{ width: '500px' }} 
            header="Solar Panel Details" 
            modal 
            className="p-fluid" 
            footer={panelDialogFooter} 
            onHide={onHide}
        >
            <div className="p-grid p-fluid">
                <div className="p-field p-col-12 p-md-6">
                    <label htmlFor="type">Panel Type*</label>
                    <Dropdown
                        id="type"
                        value={panel.type}
                        options={typeOptions}
                        onChange={(e) => onDropdownChange(e, 'type')}
                        placeholder="Select Type"
                        className={classNames({ 'p-invalid': submitted && !panel.type })}
                    />
                    {submitted && !panel.type && <small className="p-error">Type is required.</small>}
                </div>

                <div className="p-field p-col-12 p-md-6">
                    <label htmlFor="voltage">Voltage (V)*</label>
                    <InputNumber
                        id="voltage"
                        value={panel.voltage}
                        onValueChange={(e) => onNumberChange(e, 'voltage')}
                        mode="decimal"
                        min={0}
                        className={classNames({ 'p-invalid': submitted && !panel.voltage })}
                    />
                    {submitted && !panel.voltage && <small className="p-error">Voltage is required.</small>}
                </div>

                <div className="p-field p-col-12 p-md-6">
                    <label htmlFor="current">Current (A)*</label>
                    <InputNumber
                        id="current"
                        value={panel.current}
                        onValueChange={(e) => onNumberChange(e, 'current')}
                        mode="decimal"
                        min={0}
                        className={classNames({ 'p-invalid': submitted && !panel.current })}
                    />
                    {submitted && !panel.current && <small className="p-error">Current is required.</small>}
                </div>

                <div className="p-field p-col-12 p-md-6">
                    <label htmlFor="efficiency">Efficiency (%)*</label>
                    <InputNumber
                        id="efficiency"
                        value={panel.efficiency}
                        onValueChange={(e) => onNumberChange(e, 'efficiency')}
                        mode="decimal"
                        min={0}
                        max={100}
                        className={classNames({ 'p-invalid': submitted && !panel.efficiency })}
                    />
                    {submitted && !panel.efficiency && <small className="p-error">Efficiency is required.</small>}
                </div>

                <div className="p-field p-col-12 p-md-6">
                    <label htmlFor="quantity">Quantity*</label>
                    <InputNumber
                        id="quantity"
                        value={panel.quantity}
                        onValueChange={(e) => onNumberChange(e, 'quantity')}
                        mode="decimal"
                        min={1}
                        className={classNames({ 'p-invalid': submitted && !panel.quantity })}
                    />
                    {submitted && !panel.quantity && <small className="p-error">Quantity is required.</small>}
                </div>

                <div className="p-field p-col-12 p-md-6">
                    <label htmlFor="orientation">Orientation*</label>
                    <Dropdown
                        id="orientation"
                        value={panel.orientation}
                        options={orientationOptions}
                        onChange={(e) => onDropdownChange(e, 'orientation')}
                        placeholder="Select Orientation"
                        className={classNames({ 'p-invalid': submitted && !panel.orientation })}
                    />
                    {submitted && !panel.orientation && <small className="p-error">Orientation is required.</small>}
                </div>

                <div className="p-field p-col-12">
                    <label htmlFor="installDate">Installation Date*</label>
                    <Calendar
                        id="installDate"
                        value={panel.installDate}
                        onChange={(e) => onDateChange(e, 'installDate')}
                        showIcon
                        dateFormat="dd/mm/yy"
                        className={classNames({ 'p-invalid': submitted && !panel.installDate })}
                    />
                    {submitted && !panel.installDate && <small className="p-error">Installation date is required.</small>}
                </div>

                <div className="p-field p-col-12">
                    <label htmlFor="location">Location*</label>
                    <InputText
                        id="location"
                        value={panel.location}
                        onChange={(e) => onChange(e, 'location')}
                        className={classNames({ 'p-invalid': submitted && !panel.location })}
                    />
                    {submitted && !panel.location && <small className="p-error">Location is required.</small>}
                </div>
            </div>
        </Dialog>
    );
};

export default PanelFormDialog;