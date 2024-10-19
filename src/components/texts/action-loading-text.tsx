import { Icon } from "@iconify/react";
import { cn } from "@lib";
import React, { Fragment } from "react";

type ActionLoadingTextProps = {
  isLoading: boolean;
  labels?: {
    load?: string;
    loading?: string;
  };
  loadIcon?: string;
  loadingIcon?: string;
  hideLoadIcon?: boolean;
  hideLoadingIcon?: boolean;
  iconClassName?: string;
};

const ActionLoadingText = ({
  isLoading,
  labels,
  loadIcon = "flowbite:check-circle-solid",
  loadingIcon = "bx:bx-loader-alt",
  hideLoadIcon,
  hideLoadingIcon,
  iconClassName,
}: ActionLoadingTextProps) => {
  if (isLoading) {
    return (
      <Fragment>
        {!hideLoadingIcon && (
          <Icon
            icon={loadingIcon}
            className={cn("mr-2 h-6 w-6 animate-spin", iconClassName)}
          />
        )}
        {labels?.loading || "Loading"}
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        {!hideLoadIcon && (
          <Icon icon={loadIcon} className={cn("mr-2 h-6 w-6", iconClassName)} />
        )}
        {labels?.load || "Load"}
      </Fragment>
    );
  }
};

export { ActionLoadingText };
