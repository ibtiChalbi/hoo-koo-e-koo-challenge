import React, { ReactNode, useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";

interface CustomTabsProps {
  tabs: { title: string; content: ReactNode }[];
  disabled?: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      className="tab_panel"
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

const CustomTabs: React.FC<CustomTabsProps> = (props: CustomTabsProps) => {
  const [tab, setTab] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <>
      <Tabs
        value={tab}
        onChange={handleChange}
        disabled={props.disabled}
        variant="fullWidth"
      >
        {props.tabs.map((item, index) => (
          <Tab
            key={`tab-${index}-${item.title}`}
            label={item.title}
            {...a11yProps(index)}
          />
        ))}
      </Tabs>
      {props.tabs.map((item, index) => (
        <TabPanel
          key={`tab-panel-${index}-${item.title}`}
          value={tab}
          index={index}
        >
          {item.content}
        </TabPanel>
      ))}
    </>
  );
};

export default CustomTabs;
