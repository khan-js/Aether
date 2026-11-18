import { AlertActionButton, AlertModal, Button, Stack, TextInput } from "@metro/common/components";
import { findByPropsLazy } from "@metro/wrappers";

const Alerts = findByPropsLazy("openLazy", "close");

export interface InputAlertProps {
    title?: string;
    confirmText?: string;
    confirmColor?: string;
    onConfirm: (input: string) => (void | Promise<void>);
    cancelText?: string;
    placeholder?: string;
    initialValue?: string;
    secureTextEntry?: boolean;
}

// Discord's LegacyAlert/LegacyFormInput were removed in 354, so this uses AlertModal and TextInput instead
export default function InputAlert({ title, confirmText, onConfirm, cancelText, placeholder, initialValue = "", secureTextEntry }: InputAlertProps) {
    const [value, setValue] = React.useState(initialValue);
    const [error, setError] = React.useState("");
    const [isFetching, setIsFetching] = React.useState(false);

    function onConfirmWrapper() {
        setIsFetching(true);

        Promise.resolve(onConfirm(value))
            .then(() => Alerts.close())
            .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
            .finally(() => setIsFetching(false));
    }

    return (
        <AlertModal
            title={title}
            extraContent={
                <Stack style={{ marginTop: -12 }}>
                    <TextInput
                        autoFocus={true}
                        placeholder={placeholder}
                        value={value}
                        onChange={(v: string) => {
                            setValue(v);
                            if (error) setError("");
                        }}
                        returnKeyType="done"
                        onSubmitEditing={onConfirmWrapper}
                        secureTextEntry={secureTextEntry}
                        state={error ? "error" : undefined}
                        errorMessage={error || undefined}
                    />
                </Stack>
            }
            actions={
                <Stack>
                    {/* Manual button as we don't want the alert to dismiss before the input is validated */}
                    <Button
                        loading={isFetching}
                        text={confirmText ?? "Confirm"}
                        variant="primary"
                        disabled={error.length !== 0}
                        onPress={onConfirmWrapper}
                    />
                    <AlertActionButton
                        disabled={isFetching}
                        text={cancelText ?? "Cancel"}
                        variant="secondary"
                        onPress={() => Alerts.close()}
                    />
                </Stack>
            }
        />
    );
}
