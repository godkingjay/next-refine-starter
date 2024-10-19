import React from "react";

type ForProps<T> = {
    each: T[];
    children: (item: T, index: number) => React.ReactNode;
};

const For = <T extends unknown>({ each, children }: ForProps<T>) => {
    const memoizedChildren = React.useMemo(() => {
        return each.map((item, index) => {
            return children(item, index);
        });
    }, [each, children]);

    return <React.Fragment>{memoizedChildren}</React.Fragment>;
};

const MemoizedFor = React.memo(For);

MemoizedFor.displayName = "For";

export { MemoizedFor as For };
