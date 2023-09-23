import type { ReactNode } from "react";
import {
  Flex,
  Stack,
  Heading,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";

interface Item {
  title: string;
  description: string;
  panel: ReactNode;
}

interface AccordionMenuProps {
  items: Item[];
}

export default function AccordionMenu({ items, ...rest }: AccordionMenuProps) {
  return (
    <Accordion allowMultiple {...rest}>
      {items.map(({ title, description, panel }) => {
        return (
          <AccordionItem key={title}>
            <AccordionButton w="100%">
              <Flex
                align="center"
                justifyContent="space-between"
                my={2}
                w="100%"
              >
                <Stack gap={2} align="flex-start">
                  <Heading fontSize="md">{title}</Heading>
                  <Text fontSize="xs" as="span" color="secondary">
                    {description}
                  </Text>
                </Stack>
                <AccordionIcon boxSize={8} />
              </Flex>
            </AccordionButton>
            <AccordionPanel>{panel}</AccordionPanel>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
