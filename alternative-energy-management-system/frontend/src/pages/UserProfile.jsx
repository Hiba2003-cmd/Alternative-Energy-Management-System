import React, { useState, useEffect, useRef } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Panel } from "primereact/panel";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { userService } from "../services/userService";
import { Checkbox } from "primereact/checkbox";

const UserProfile = () => {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    location: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    notificationPreferences: {
    lowProductionWarnings :false,
    overconsumptionAlerts : false,
    weeklyEnergyReports :false,
    monthlyEnergyReports : false
    }
  });

  const locationOptions = [
    { label: 'Damascus, Syria', value: 'Damascus, Syria' },
    { label: 'Aleppo, Syria', value: 'Aleppo, Syria' },
    { label: 'Homs, Syria', value: 'Homs, Syria' },
    { label: 'Hama, Syria', value: 'Hama, Syria' },
    { label: 'Latakia, Syria', value: 'Latakia, Syria' },
    { label: 'Tartus, Syria', value: 'Tartus, Syria' },
    { label: 'Idlib, Syria', value: 'Idlib, Syria' },
    { label: 'Deir ez-Zor, Syria', value: 'Deir ez-Zor, Syria' },
    { label: 'Raqqa, Syria', value: 'Raqqa, Syria' },
    { label: 'Al-Hasakah, Syria', value: 'Al-Hasakah, Syria' },
    { label: 'Daraa, Syria', value: 'Daraa, Syria' },
    { label: 'As-Suwayda, Syria', value: 'As-Suwayda, Syria' },
    { label: 'Quneitra, Syria', value: 'Quneitra, Syria' },
    { label: 'Rif Dimashq, Syria', value: 'Rif Dimashq, Syria' }
  ];
  

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (storedUser.id) {
          const userData = await userService.getUserById(storedUser.id);
          setUser(userData);
          setProfile({
            name: userData.name || "",
            email: userData.email || "",
            location: userData.location || "",
            notificationPreferences: {...(userData.notificationPreferences || {})},
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        }
      } catch (error) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to load profile data",
          life: 3000,
        });
      }
    };

    loadUserData();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setProfile((prev) => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [name]: checked,
      },
    }));
  };
  

  const saveProfile = async () => {
    if (!user) return;

    setLoading(true);

    try {
      const updatedUser = await userService.updateUserProfile(user.id, {
        ...user,
        name: profile.name,
        location: profile.location,
        notificationPreferences: {...profile.notificationPreferences}
      });

      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          name: profile.name,
          location: profile.location,
          notificationPreferences: profile.notificationPreferences
        })
      );

      setUser(updatedUser);

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Profile updated successfully",
        life: 3000,
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Failed to update profile",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    if (profile.newPassword !== profile.confirmPassword) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Passwords do not match",
        life: 3000,
      });
      return;
    }

    if (profile.newPassword.length < 8) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Password must be at least 8 characters",
        life: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      await userService.changePassword(
        profile.currentPassword,
        profile.newPassword
      );

      setProfile((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Password changed successfully",
        life: 3000,
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Failed to change password",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="p-4">Loading profile...</div>;
  }

  return (
    <div className="grid p-fluid">
      <Toast ref={toast} />
      <div className="col-12">
        <h1>User Profile</h1>
      </div>

      <div className="col-12 md:col-6">
        <Card title="Personal Information" className="h-full">
          <div className="field">
            <label htmlFor="name">Full Name</label>
            <InputText
              id="name"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
            />
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <InputText id="email" name="email" value={profile.email} disabled />
            <small className="text-gray-500">
              Email address cannot be changed
            </small>
          </div>

          <div className="field">
            <label htmlFor="location">Location</label>
            <Dropdown
              id="location"
              name="location"
              value={profile.location}
              options={locationOptions}
              onChange={handleProfileChange}
              placeholder="Select Location"
              className="w-full"
            />
          </div>

          <Button
            label="Save Changes"
            icon="pi pi-check"
            onClick={saveProfile}
            loading={loading}
            className="mt-3"
          />
        </Card>
      </div>

      <div className="col-12 md:col-6">
        <Card title="Security Settings" className="h-full">
          <div className="field">
            <label htmlFor="currentPassword">Current Password</label>
            <Password
              id="currentPassword"
              name="currentPassword"
              value={profile.currentPassword}
              onChange={handleProfileChange}
              feedback={false}
              toggleMask
            />
          </div>

          <div className="field">
            <label htmlFor="newPassword">New Password</label>
            <Password
              id="newPassword"
              name="newPassword"
              value={profile.newPassword}
              onChange={handleProfileChange}
              toggleMask
              promptLabel="Choose a password"
              weakLabel="Too simple"
              mediumLabel="Average complexity"
              strongLabel="Complex password"
            />
            <small className="text-gray-500">
              Password must be at least 8 characters with uppercase, lowercase,
              and numbers
            </small>
          </div>

          <div className="field">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <Password
              id="confirmPassword"
              name="confirmPassword"
              value={profile.confirmPassword}
              onChange={handleProfileChange}
              feedback={false}
              toggleMask
            />
          </div>

          <Button
            label="Change Password"
            icon="pi pi-key"
            onClick={changePassword}
            loading={loading}
            className="mt-3"
          />
        </Card>
      </div>

      <div className="col-12">
        <Panel header="Notification Preferences">
          <div className="grid">
            <div className="col-12 md:col-6">
              <h3>Alert Settings</h3>

              <div className="field-checkbox mb-3">
                <Checkbox
                  inputId="lowProductionWarnings"
                  name="lowProductionWarnings"
                  checked={profile.notificationPreferences.lowProductionWarnings}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="lowProductionWarnings" className="ml-2">
                  Low production Warnings
                </label>
              </div>

              <div className="field-checkbox mb-3">
                <Checkbox
                  inputId="overconsumptionAlerts"
                  name="overconsumptionAlerts"
                  checked={profile.notificationPreferences.overconsumptionAlerts}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="overconsumptionAlerts" className="ml-2">
                  Overconsumption Alerts
                </label>
              </div>
            </div>

            <div className="col-12 md:col-6">
              <h3>Report Preferences</h3>
              <div className="field-checkbox mb-3">
                <Checkbox
                  inputId="weeklyEnergyReports"
                  name="weeklyEnergyReports"
                  checked={profile.notificationPreferences.weeklyEnergyReports}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="weeklyEnergyReports" className="ml-2">
                  Weekly energy Reports
                </label>
              </div>

              <div className="field-checkbox mb-3">
                <Checkbox
                  inputId="monthlyEnergyReports"
                  name="monthlyEnergyReports"
                  checked={profile.notificationPreferences.monthlyEnergyReports}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="monthlyEnergyReports" className="ml-2">
                  Monthly energy Reports
                </label>
              </div>
            </div>
          </div>

          <Divider />

          <Button
            label="Save Preferences"
            icon="pi pi-save"
            onClick={saveProfile}
            loading={loading}
            className="mt-2"
          />
        </Panel>
      </div>
    </div>
  );
};

export default UserProfile;
