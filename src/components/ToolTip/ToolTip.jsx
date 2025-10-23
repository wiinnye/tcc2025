import * as Tooltip from "@radix-ui/react-tooltip";

export default function ToolTipContainer({ children, descricao }) {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
            {children}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            style={{
              backgroundColor: "#fff",
              color: "#000",
              borderRadius: "4px",
              padding: "6px 10px",
              fontSize: "14px",
            }}
          >
            {descricao}
            <Tooltip.Arrow />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
