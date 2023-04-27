import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

export default function HablaTabs({ tabs }) {
  return (
    <Tabs variant="soft-rounded" colorScheme="purple">
      <TabList>
        {tabs.map(({ name }) => {
          return <Tab key={name}>{name}</Tab>;
        })}
      </TabList>
      <TabPanels>
        {tabs.map(({ name, panel }) => (
          <TabPanel key={`${name}-panel`} px={0}>
            {panel}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
}
