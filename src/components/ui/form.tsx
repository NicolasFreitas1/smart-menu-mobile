import React, { createContext, useContext, useId } from "react"
import { View, Text, TextInput, TextProps, ViewProps } from "react-native"
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: ControllerProps<TFieldValues, TName>
) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

function FormItem({ style, ...props }: ViewProps) {
  const id = useId()
  return (
    <FormItemContext.Provider value={{ id }}>
      <View style={[{ gap: 8 }, style]} {...props} />
    </FormItemContext.Provider>
  )
}

function useFormField() {
  const fieldContext = useContext(FormFieldContext)
  const itemContext = useContext(FormItemContext)
  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext.name })
  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField must be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

function FormLabel({ style, children }: TextProps) {
  const { error } = useFormField()

  return (
    <Text style={[{ color: error ? "red" : "#000", fontWeight: "bold" }, style]}>
      {children}
    </Text>
  )
}

function FormControl({
  children,
  ...props
}: React.ComponentProps<typeof TextInput>) {
  const { error } = useFormField()

  return React.cloneElement(children as any, {
    ...props,
    style: [
      (children as any)?.props?.style,
      { borderColor: error ? "red" : "#ccc", borderWidth: 1, padding: 8 },
    ],
  })
}

function FormDescription({ style, children }: TextProps) {
  return <Text style={[{ fontSize: 12, color: "#666" }, style]}>{children}</Text>
}

function FormMessage({ style }: TextProps) {
  const { error } = useFormField()
  if (!error) return null

  return (
    <Text style={[{ fontSize: 12, color: "red" }, style]}>
      {String(error.message)}
    </Text>
  )
}

export {
  FormProvider as Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFormField,
}
