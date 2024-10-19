import { cn } from "@/lib/utils";
import { Check, ChevronRight, Minus } from "lucide-react";
import React, { FunctionComponent, useEffect, useState } from "react";

interface TreeNodeData {
  id: string;
  label: string;
  children?: TreeNodeData[];
  checked?: boolean;
  icon?: React.ReactNode;
}

interface TreeNodeProps {
  node: TreeNodeData;
  onCheck: (id: string, checked: boolean) => void;
  onExpand: (id: string) => void;
  onSelect?: (node: TreeNodeData) => void;
  expandedKeys: string[];
  checkable: boolean;
  endContent: React.ReactNode;
  className?: string;
  showLine: boolean;
}

const TreeNode: FunctionComponent<TreeNodeProps> = ({
  node,
  onCheck,
  onExpand,
  onSelect,
  expandedKeys,
  checkable,
  endContent,
  className,
  showLine,
}) => {
  const { id, label, children, checked, icon } = node;
  const [isChecked, setIsChecked] = useState<boolean>(checked || false);
  const [isIndeterminate, setIsIndeterminate] = useState<boolean>(false);

  useEffect(() => {
    setIsChecked(checked || false);
  }, [checked]);

  useEffect(() => {
    const someChecked = children && children.some((child) => child.checked);
    const allChecked = children && children.every((child) => child.checked);

    setIsIndeterminate(someChecked && !allChecked ? true : false);
  }, [children]);

  const handleCheck = () => {
    const updatedChecked = !isChecked;
    setIsChecked(updatedChecked);
    setIsIndeterminate(false);
    onCheck(id, updatedChecked);
  };

  const hasChildren = children && children.length > 0;
  const handleExpand = () => {
    if (hasChildren) {
      onExpand(id);
    }
  };

  const handleSelect = () => {
    if (onSelect) {
      onSelect(node);
    }
  };

  return (
    <div
      className={cn("relative z-[1] space-y-3", {
        "before:absolute before:top-0 before:z-[-1] before:h-[calc(100%-23px)] before:w-[2px] before:rounded before:bg-secondary ltr:before:left-2 rtl:before:right-2":
          hasChildren && expandedKeys.includes(id) && showLine,
      })}
    >
      <div className="flex items-center gap-1.5">
        {checkable && (
          <label className="relative top-1 block flex-none">
            <input
              type="checkbox"
              className="hidden"
              checked={isChecked}
              onChange={handleCheck}
              onClick={handleSelect}
              ref={(input) => {
                if (input) {
                  (input as HTMLInputElement).indeterminate = isIndeterminate;
                }
              }}
            />
            <span
              className={cn(
                "inline-flex h-4 w-4 cursor-pointer rounded border",
                {
                  "border-primary bg-primary": isChecked || isIndeterminate,
                  "border-default-200 bg-background":
                    !isChecked && !isIndeterminate,
                }
              )}
            >
              {isChecked && (
                <Check className="h-3.5 w-3.5 stroke-primary-foreground" />
              )}
              {isIndeterminate && (
                <Minus className="h-3.5 w-3.5 stroke-primary-foreground" />
              )}
            </span>
          </label>
        )}
        <div
          data-open={hasChildren && expandedKeys.includes(id) ? "true" : null}
          className={cn(
            "text data-[open=true]:bg-default-200/80 inline-flex cursor-pointer items-center gap-3 rounded px-3 py-3 text-base font-medium transition-all duration-200 [&_.menu-arrow>svg]:h-4 [&_.menu-arrow>svg]:w-4",
            className
          )}
          onClick={handleExpand}
        >
          {icon && <span className="[&>svg]:h-4 [&>svg]:w-5">{icon}</span>}
          <span className="inline-flex leading-none">{label}</span>
          {hasChildren && (
            <button
              onClick={handleExpand}
              className={cn(
                "menu-arrow flex-none transform leading-none transition-all duration-200 rtl:rotate-180",
                {
                  "rotate-90 rtl:rotate-90": expandedKeys.includes(id),
                }
              )}
            >
              {endContent}
            </button>
          )}
        </div>
      </div>

      {hasChildren && (
        <div className="relative ltr:ml-5 rtl:mr-5">
          {expandedKeys.includes(id) &&
            children.map((child) => (
              <React.Fragment key={child.id}>
                {showLine && (
                  <span className="absolute mt-1.5 ltr:-left-3 rtl:right-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                    >
                      <path
                        d="M1 1v4a8 8 0 0 0 8 8h4"
                        className="stroke-linecap-round fill-none stroke-secondary stroke-2"
                      />
                    </svg>
                  </span>
                )}
                <TreeNode
                  node={child}
                  onCheck={onCheck}
                  onExpand={onExpand}
                  onSelect={onSelect}
                  expandedKeys={expandedKeys}
                  checkable={checkable}
                  endContent={endContent}
                  className={className}
                  showLine={showLine}
                />
              </React.Fragment>
            ))}
        </div>
      )}
    </div>
  );
};

interface TreeProps {
  data: TreeNodeData[];
  onSelect?: (node: TreeNodeData) => void;
  defaultExpandedKeys?: string[];
  defaultSelectedKeys?: string[];
  defaultCheckedKeys?: string[];
  onCheck?: (data: TreeNodeData[]) => void;
  checkable?: boolean;
  endContent?: React.ReactNode;
  className?: string;
  showLine?: boolean;
}

const Tree: FunctionComponent<TreeProps> = ({
  data = [],
  onSelect,
  defaultExpandedKeys = [],
  defaultSelectedKeys = [],
  defaultCheckedKeys = [],
  onCheck,
  checkable = false,
  endContent = <ChevronRight />,
  className,
  showLine = false,
}) => {
  const [treeData, setTreeData] = useState<TreeNodeData[]>(data);
  const [expandedKeys, setExpandedKeys] =
    useState<string[]>(defaultExpandedKeys);

  useEffect(() => {
    setTreeData(data);
  }, [data]);

  const handleCheck = (nodeId: string) => {
    const updatedData = toggleNodeChecked(treeData, nodeId);
    setTreeData(updatedData);
    if (onCheck) {
      onCheck(updatedData);
    }
  };

  const toggleNodeChecked = (
    nodes: TreeNodeData[],
    nodeId: string
  ): TreeNodeData[] => {
    return nodes.map((node) => {
      if (node.id === nodeId) {
        const updatedNode = { ...node, checked: !node.checked };
        if (updatedNode.children) {
          updatedNode.children = toggleAllChildren(
            updatedNode.children,
            updatedNode.checked || false
          );
        }
        return updatedNode;
      } else if (node.children) {
        const updatedChildren = toggleNodeChecked(node.children, nodeId);
        const allChecked = updatedChildren.every((child) => child.checked);
        const someChecked = updatedChildren.some((child) => child.checked);

        return {
          ...node,
          children: updatedChildren,
          checked: allChecked ? true : someChecked ? undefined : false,
        };
      }
      return node;
    });
  };

  const toggleAllChildren = (
    children: TreeNodeData[],
    checked: boolean
  ): TreeNodeData[] => {
    return children.map((child) => ({
      ...child,
      checked,
      children: child.children
        ? toggleAllChildren(child.children, checked)
        : undefined,
    }));
  };

  const handleExpand = (nodeId: string) => {
    setExpandedKeys((prevExpandedKeys) =>
      prevExpandedKeys.includes(nodeId)
        ? prevExpandedKeys.filter((key) => key !== nodeId)
        : [...prevExpandedKeys, nodeId]
    );
  };

  const handleSelect = (selectedNode: TreeNodeData) => {
    if (onSelect) {
      onSelect(selectedNode);
    }
  };

  return (
    <div>
      {treeData.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          onCheck={handleCheck}
          onExpand={handleExpand}
          expandedKeys={expandedKeys}
          onSelect={handleSelect}
          checkable={checkable}
          endContent={endContent}
          className={className}
          showLine={showLine}
        />
      ))}
    </div>
  );
};

export { Tree };
