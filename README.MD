# refine-project

<div align="center" style="margin: 30px;">
    <a href="https://refine.dev">
    <img alt="refine logo" src="https://refine.ams3.cdn.digitaloceanspaces.com/readme/refine-readme-banner.png">
    </a>
</div>
<br/>

This [Refine](https://github.com/refinedev/refine) project was generated with [create refine-app](https://github.com/refinedev/refine/tree/master/packages/create-refine-app).

## Getting Started

A React Framework for building internal tools, admin panels, dashboards & B2B apps with unmatched flexibility ✨

Refine's hooks and components simplifies the development process and eliminates the repetitive tasks by providing industry-standard solutions for crucial aspects of a project, including authentication, access control, routing, networking, state management, and i18n.

## Available Scripts

### Running the development server.

```bash
    pnpm dev
```

### Building for production.

```bash
    pnpm build
```

### Running the production server.

```bash
    pnpm start
```

## Sample API Calls

### POST Method

```ts
export const useDealerCreate = () => {
  return useCustomCreate<
    CreateDealerPayload,
    CreateDealerResponse,
    BaseApiErrorResponse
  >("/api/accounts/dealer");
};
```

#### Usage

```ts
const createDealer = useDealerCreate();

const { handleMutate: handleCreateDealer } = createDealer;

const onSubmit = () => {
    const basePayload = {
        first_name: "John",
        last_name: "John",
        email: "johndoe@example.com",
        username: "john",
        password: "password",
    };

    handleCreateDealer(
        {
            ...basePayload,
        },
        {
            onSuccess: (data) => {
                const successMessage = 
                    data?.data?.message ?? 
                    "Dealer created successfully."

                console.log(successMessage);
            },
            onError: (error) => {
                const errorMessage =
                    error?.response?.data?.message ??
                    "An error occurred while creating the dealer.";

                console.error(errorMessage)
            },
        }
    );
}
```

### PUT Method

```ts
export const useDealerUpdate = () => {
  return useCustomUpdate<
    UpdateDealerPayload,
    UpdateDealerResponse,
    BaseApiErrorResponse
  >("/api/accounts/dealer");
};
```

#### Usage

```ts
const [dealerId, setDealerId] = useState<string | number>(0);
const updateDealer = useDealerUpdate();

const { handleMutate: handleUpdateDealer } = updateDealer;

const onSubmit = () => {
    const basePayload = {
        first_name: "John",
        last_name: "John",
        email: "johndoe@example.com",
        username: "john",
    };

    handleUpdateDealer(
        String(dealerId),
        {
            ...basePayload,
        },
        {
            onSuccess: (data) => {
                const successMessage = 
                    data?.data?.message ?? 
                    "Dealer updated successfully."

                console.log(successMessage);
            },
            onError: (error) => {
                const errorMessage =
                    error?.response?.data?.message ??
                    "An error occurred while updating the dealer.";

                console.error(errorMessage)
            },
        }
    );
}
```

### DELETE Method

```ts
export const useDealerDelete = () => {
  return useCustomDelete<DeleteDealerResponse, BaseApiErrorResponse>(
    "/api/accounts/dealers"
  );
};
```

#### Usage

```ts
const [dealerId, setDealerId] = useState<string | number>(0);
const deleteDealer = useDealerDelete();

const { handleMutate: handleDeleteDealer } = deleteDealer;

const onDelete = () => {
    handleDeleteDealer(String(dealerId), {
        onSuccess: (data) => {
            const successMessage = 
                data?.data?.message ?? 
                "Dealer deleted successfully."

            console.log(successMessage);
        },
        onError: (error) => {
            const errorMessage =
                error?.response?.data?.message ??
                "An error occurred while deleting the dealer.";

            console.error(errorMessage)
        },
    });
}
```

### GET Method

```ts
export const useDealerList = (props?: useDealerListProps) => {
  return useCustomList<DealerResource>({
    resource: "/api/accounts/dealer",
    pagination: {
      current: 1,
      pageSize: 10,
    },
    ...props,
  });
};
```

#### Usage

```tsx
const { customData } = useDealerList();

return (
    <ul>
        {(customData.data ?? []).map(dealer => (
            <li key={dealer.id}>
                {dealer.first_name} {dealer.last_name}
            </li>
        ))}
    </ul>
);
```

### GET One Method

```ts
export const useDealerData = (id: string) => {
  return useCustomOne<DealerResource>({
    resource: "/api/accounts/dealer",
    id: id,
  });
};
```

#### Usage

```tsx
const { customData } = useDealerData();

return (
    <div className="flex flex-col gap-2">
        <p>
            <strong>First Name: </strong> {customData.data.first_name}
        </p>
        <p>
            <strong>Last Name: </strong> {customData.data.last_name}
        </p>
        <p>
            <strong>Username: </strong> {customData.data.username}
        </p>
        <p>
            <strong>Email: </strong> {customData.data.email}
        </p>
    </div>
);
```

## Learn More

To learn more about **Refine**, please check out the [Documentation](https://refine.dev/docs)

- **REST Data Provider** [Docs](https://refine.dev/docs/core/providers/data-provider/#overview)
- **Custom Auth Provider** [Docs](https://refine.dev/docs/core/providers/auth-provider/)

## License

MIT
