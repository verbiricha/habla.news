import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

export default function HablaTabs({ tabs, ...rest }) {
  return (
    <Tabs variant="soft-rounded" colorScheme="orange" width="100%" {...rest}>
      <TabList>
        {tabs.map(({ name }) => {
          return (
            <Tab key={name} fontFamily="'Inter'" fontWeight={400}>
              {name}
            </Tab>
          );
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
