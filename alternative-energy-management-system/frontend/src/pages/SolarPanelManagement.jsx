import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { formatDate } from "../utils/formatUtils";
import { authService } from "../services/authService";
import { solarPanelService } from "../services/solarPanelService";
import SolarProductionCharts from "../components/SolarProductionCharts";
import PanelFormDialog from "../components/PanelFormDialog";

const SolarPanelManagement = () => {
  const toast = useRef(null);
  const [panels, setPanels] = useState([]);
  const [selectedPanel, setSelectedPanel] = useState(null);
  const [panelDialog, setPanelDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  const currentUser = authService.getCurrentUser();
  const userId = currentUser ? currentUser.uid : null;

  function getEmptyPanel() {
    return {
      id: null,
      userId: userId,
      type: "",
      voltage: 0,
      current: 0,
      efficiency: 0,
      quantity: 1,
      orientation: "",
      installDate: null,
      location: "",
    };
  }

  const [panel, setPanel] = useState(getEmptyPanel());

  const typeOptions = [
    { label: "Monocrystalline", value: "Monocrystalline" },
    { label: "Polycrystalline", value: "Polycrystalline" },
    { label: "Thin-Film", value: "Thin-Film" },
    { label: "PERC", value: "PERC" },
    { label: "Bifacial", value: "Bifacial" },
    { label: "Other", value: "Other" },
  ];

  const orientationOptions = [
    { label: "North", value: "North" },
    { label: "Northeast", value: "Northeast" },
    { label: "East", value: "East" },
    { label: "Southeast", value: "Southeast" },
    { label: "South", value: "South" },
    { label: "Southwest", value: "Southwest" },
    { label: "West", value: "West" },
    { label: "Northwest", value: "Northwest" },
  ];

  useEffect(() => {
    if (userId) {
      loadPanels();
    } else {
      setLoading(false);
      toast.current.show({
        severity: "warn",
        summary: "Authentication",
        detail: "Please log in to manage your solar panels",
        life: 3000,
      });
    }
  }, [userId]);

  const loadPanels = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const data = await solarPanelService.getPanelsByUserId(userId);
      setPanels(data);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load solar panels",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const openNew = () => {
    setPanel(getEmptyPanel());
    setSubmitted(false);
    setPanelDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setPanelDialog(false);
  };

  const savePanel = async () => {
    setSubmitted(true);

    if (!userId) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "You must be logged in to save panels",
        life: 3000,
      });
      return;
    }

    if (
      panel.type &&
      panel.voltage &&
      panel.current &&
      panel.efficiency &&
      panel.quantity &&
      panel.orientation &&
      panel.installDate &&
      panel.location
    ) {
      try {
        let savedPanel;

        if (panel.id) {
          savedPanel = await solarPanelService.updatePanel(panel);
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Solar Panel Updated",
            life: 3000,
          });
        } else {
          savedPanel = await solarPanelService.createPanel(panel);
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Solar Panel Created",
            life: 3000,
          });
        }

        await loadPanels();

        setPanelDialog(false);
        setPanel(getEmptyPanel());
      } catch (error) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to save solar panel",
          life: 3000,
        });
      }
    }
  };

  const editPanel = (panel) => {
    const panelToEdit = { ...panel };
    if (typeof panelToEdit.installDate === "string") {
      panelToEdit.installDate = new Date(panelToEdit.installDate);
    }
    setPanel(panelToEdit);
    setPanelDialog(true);
  };

  const confirmDeletePanel = (panel) => {
    setPanel(panel);
    confirmDialog({
      message: "Are you sure you want to delete this solar panel?",
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => deletePanel(panel.id),
    });
  };

  const deletePanel = async (id) => {
    try {
      await solarPanelService.deletePanel(id);
      await loadPanels();
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Solar Panel Deleted",
        life: 3000,
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete solar panel",
        life: 3000,
      });
    }
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _panel = { ...panel };
    _panel[name] = val;
    setPanel(_panel);
  };

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _panel = { ...panel };
    _panel[name] = val;
    setPanel(_panel);
  };

  const onDateChange = (e, name) => {
    let _panel = { ...panel };
    _panel[name] = e.value;
    setPanel(_panel);
  };

  const onDropdownChange = (e, name) => {
    let _panel = { ...panel };
    _panel[name] = e.value;
    setPanel(_panel);
  };

  const calculatePower = (rowData) => {
    const basePower = solarPanelService.helpers.calculateBasePowerProduction(rowData);
    return <span>{basePower.toFixed(2)} W</span>;
  };
  
  const calculateDailyPowerPerPanel = (rowData) => {
    const dailyProduction = solarPanelService.helpers.calculateDailyPowerProduction(rowData);
    return <span>{dailyProduction.toFixed(2)} W</span>;
  };
  
  const installDateTemplate = (rowData) => {
    return formatDate(rowData.installDate);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex justify-content-end">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editPanel(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          onClick={() => confirmDeletePanel(rowData)}
        />
      </div>
    );
  };

  const header = (
    <div className="flex justify-content-between align-items-center">
      <h5 className="m-0">Manage Solar Panels</h5>
      <Button
        label="Add New Panel"
        icon="pi pi-plus"
        className="p-button-success"
        onClick={openNew}
        disabled={!userId}
      />
    </div>
  );

  const renderContent = () => {
    if (!userId) {
      return (
        <div className="flex flex-column align-items-center p-5">
          <i className="pi pi-lock text-6xl mb-3 text-yellow-500"></i>
          <h3>Authentication Required</h3>
          <p>Please log in to manage your solar panels.</p>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="flex justify-content-center py-5">
          <ProgressSpinner />
        </div>
      );
    }

    return (
      <>
        <DataTable
          value={panels}
          selection={selectedPanel}
          onSelectionChange={(e) => setSelectedPanel(e.value)}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          className="p-datatable-responsive"
          header={header}
          emptyMessage="No solar panels found"
          removableSort
        >
          <Column
            field="id"
            header="ID"
            sortable
            style={{ width: "5%" }}
          ></Column>
          <Column
            field="type"
            header="Type"
            sortable
            style={{ width: "10%" }}
          ></Column>
          <Column
            field="voltage"
            header="Voltage (V)"
            sortable
            style={{ width: "10%" }}
          ></Column>
          <Column
            field="current"
            header="Current (A)"
            sortable
            style={{ width: "10%" }}
          ></Column>
          <Column
            header="Power"
            body={calculatePower}
            sortable
            style={{ width: "15%" }}
          ></Column>
           <Column
            header="Average Daily production"
            body={calculateDailyPowerPerPanel}
            sortable
            style={{ width: "10%" }}
          ></Column>
          <Column
            field="efficiency"
            header="Efficiency (%)"
            sortable
            style={{ width: "10%" }}
          ></Column>
          <Column
            field="quantity"
            header="Quantity"
            sortable
            style={{ width: "8%" }}
          ></Column>
          <Column
            field="orientation"
            header="Orientation"
            sortable
            style={{ width: "12%" }}
          ></Column>
          <Column
            field="installDate"
            header="Install Date"
            body={installDateTemplate}
            sortable
            style={{ width: "12%" }}
          ></Column>
          <Column body={actionBodyTemplate} style={{ width: "10%" }}></Column>
        </DataTable>

        {panels.length > 0 && (
          <div className="mt-4">
            <SolarProductionCharts panels={panels} userId={userId} />
          </div>
        )}
      </>
    );
  };

  return (
    <div className="grid">
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className="col-12">
        <h1>Solar Panel Management</h1>
        <p className="text-500">
          Manage and monitor your solar panel installation and energy production
        </p>
      </div>

      <div className="col-12">
        <Card>{renderContent()}</Card>
      </div>

      <PanelFormDialog
        visible={panelDialog}
        panel={panel}
        submitted={submitted}
        typeOptions={typeOptions}
        orientationOptions={orientationOptions}
        onHide={hideDialog}
        onSave={savePanel}
        onChange={onInputChange}
        onNumberChange={onInputNumberChange}
        onDateChange={onDateChange}
        onDropdownChange={onDropdownChange}
      />
    </div>
  );
};

export default SolarPanelManagement;
