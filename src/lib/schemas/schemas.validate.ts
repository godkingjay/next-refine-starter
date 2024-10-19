import { formatNumber } from "@lib/format";
import { isEmpty, isNotEmpty, isNumber } from "@lib/utils";
import validator from "validator";
import { z } from "zod";
import {
    emailValidator,
    generalNameValidator,
    nameValidator,
    numberValidator,
    passwordValidator,
    textValidator,
    urlValidator,
} from "./schemas.rule";

export const schemaValidateRequired = (
    name: string = "Field",
    value: any,
    ctx: z.RefinementCtx,
    path: (string | number)[] = ["field"],
    set?: Set<string> | null
) => {
    if (isNotEmpty(value)) {
        if (set && set.has(value)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `${name} is a duplicate`,
                path: path,
            });
        }
    } else {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${name} is required`,
            path: path,
        });
    }
};

/**
 * Validate email of form schemas
 *
 * @param {string} name - The name of the email
 * @param {string | undefined} email - The email to validate
 * @param {z.RefinementCtx} ctx - The context of the schema
 * @param {(string | number)[]} path - The path of the schema
 * @param {Set<string>} set - The set of emails
 * @param {{ required?: boolean }} options - The options of the schema
 * @returns {void}
 */
export const schemaValidateEmail = (
    name: string = emailValidator.replace.values.name.default,
    email: string | undefined,
    ctx: z.RefinementCtx,
    path: (string | number)[] = ["email"],
    set?: Set<string> | null,
    options?: {
        required?: boolean;
    }
) => {
    if (isNotEmpty(email) && email) {
        if (
            !email.match(
                new RegExp(
                    emailValidator.regex.value,
                    emailValidator.regex.flags
                )
            )
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: emailValidator.valid.customMessage.replace(
                    emailValidator.replace.values.name.variable,
                    name
                ),
                path: path,
            });
        } else if (set && set.has(email)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: emailValidator.duplicate.customMessage.replace(
                    emailValidator.replace.values.name.variable,
                    name
                ),
                path: path,
            });
        }
    } else if (options?.required && isEmpty(email)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: emailValidator.required.customMessage.replace(
                emailValidator.replace.values.name.variable,
                name
            ),
            path: path,
        });
    }
};

/**
 * Validate general name of form schemas
 *
 * @param {string} nameType - The type of name to validate
 * @param {string | undefined} name - The name to validate
 * @param {z.RefinementCtx} ctx - The context of the schema
 * @param {(string | number)[]} path - The path of the schema
 * @param {Set<string>} set - The set of company sizes
 * @param {{
 * 	required?: boolean;
 * }} options - The options of the schema
 */
export const schemaValidateGeneralName = (
    nameType: string = generalNameValidator.replace.values.name.default,
    name: string | undefined,
    ctx: z.RefinementCtx,
    path: (string | number)[] = ["name"],
    set?: Set<string>,
    options?: {
        required?: boolean;
        min?: number;
        max?: number;
    }
) => {
    options = {
        required: false,
        min: options?.min ?? generalNameValidator.replace.values.min.default,
        max: options?.max ?? generalNameValidator.replace.values.max.default,
        ...options,
    };

    options.min = formatNumber(options.min);
    options.max = formatNumber(options.max);

    if (isNotEmpty(name) && name) {
        if (name.length < options.min) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: generalNameValidator.min.customMessage
                    .replace(
                        generalNameValidator.replace.values.name.variable,
                        nameType
                    )
                    .replace(
                        generalNameValidator.replace.values.min.variable,
                        options.min.toString()
                    ),
                path: path,
            });
        } else if (name.length > options.max) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: generalNameValidator.max.customMessage
                    .replace(
                        generalNameValidator.replace.values.name.variable,
                        nameType
                    )
                    .replace(
                        generalNameValidator.replace.values.max.variable,
                        options.max.toString()
                    ),
                path: path,
            });
        } else if (
            !name.match(
                new RegExp(
                    generalNameValidator.regex.value,
                    generalNameValidator.regex.flags
                )
            )
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: generalNameValidator.regex.customMessage.replace(
                    generalNameValidator.replace.values.name.variable,
                    nameType
                ),
                path: path,
            });
        } else if (set && set.has(name)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: generalNameValidator.duplicate.customMessage.replace(
                    generalNameValidator.replace.values.name.variable,
                    nameType
                ),
                path: path,
            });
        }
    } else if (options?.required && isEmpty(name)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: generalNameValidator.required.customMessage.replace(
                generalNameValidator.replace.values.name.variable,
                nameType
            ),
            path: path,
        });
    }
};

/**
 * Validate name of form schemas
 *
 * @param {string} nameType - The type of name to validate
 * @param {string | undefined} name - The name to validate
 * @param {z.RefinementCtx} ctx - The context of the schema
 * @param {(string | number)[]} path - The path of the schema
 * @param {Set<string>} set - The set of names
 * @param {{ required?: boolean }} options - The options of the schema
 */
export const schemaValidateName = (
    nameType: string = nameValidator.replace.values.name.default,
    name: string | undefined,
    ctx: z.RefinementCtx,
    path: (string | number)[] = ["name"],
    set?: Set<string>,
    options?: {
        required?: boolean;
        min?: number;
        max?: number;
    }
) => {
    options = {
        required: false,
        min: nameValidator.replace.values.min.default,
        max: nameValidator.replace.values.max.default,
        ...options,
    };

    options.min = formatNumber(options.min);
    options.max = formatNumber(options.max);

    if (isNotEmpty(name) && name) {
        if (name.length < options.min) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: nameValidator.min.customMessage
                    .replace(
                        nameValidator.replace.values.name.variable,
                        nameType
                    )
                    .replace(
                        nameValidator.replace.values.min.variable,
                        options.min.toString()
                    ),
                path: path,
            });
        } else if (name.length > options.max) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: nameValidator.max.customMessage
                    .replace(
                        nameValidator.replace.values.name.variable,
                        nameType
                    )
                    .replace(
                        nameValidator.replace.values.max.variable,
                        options.max.toString()
                    ),
                path: path,
            });
        } else if (
            !name.match(
                new RegExp(nameValidator.regex.value, nameValidator.regex.flags)
            )
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: nameValidator.regex.customMessage.replace(
                    nameValidator.replace.values.name.variable,
                    nameType
                ),
                path: path,
            });
        } else if (set && set.has(name)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: nameValidator.duplicate.customMessage.replace(
                    nameValidator.replace.values.name.variable,
                    nameType
                ),
                path: path,
            });
        }
    } else if (options?.required && isEmpty(name)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: nameValidator.required.customMessage.replace(
                nameValidator.replace.values.name.variable,
                nameType
            ),
            path: path,
        });
    }
};

/**
 * Validate number of form schemas
 *
 * @param {string} name - The name of the number
 * @param {string | number | undefined} number - The number to validate
 * @param {z.RefinementCtx} ctx - The context of the schema
 * @param {(string | number)[]} path - The path of the number
 * @param {Set<string | number>} set - The set of numbers
 * @param {{ min?: number; max?: number; required?: boolean }} options - The options of the schema
 * @returns {void}
 */
export const schemaValidateNumber = (
    name: string = numberValidator.replace.values.name.default,
    number: string | number | undefined,
    ctx: z.RefinementCtx,
    path: (string | number)[] = ["number"],
    set?: Set<string | number>,
    options?: {
        min?: number;
        max?: number;
        required?: boolean;
    }
) => {
    const isSet = {
        min: isNumber(options?.min),
        max: isNumber(options?.max),
    };

    options = {
        min: numberValidator.replace.values.min.default,
        max: numberValidator.replace.values.max.default,
        required: false,
        ...options,
    };

    options.min = formatNumber(options.min, undefined);
    options.max = formatNumber(options.max, undefined);

    if (isNotEmpty(number) && number) {
        number = formatNumber(number);

        if (!isNumber(number)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: numberValidator.valid.customMessage.replace(
                    numberValidator.replace.values.name.variable,
                    name
                ),
                path: path,
            });
        } else if (
            isNotEmpty(options?.max) &&
            isNotEmpty(options?.min) &&
            options?.max &&
            options?.min &&
            (number < options.min || number > options.max) &&
            isSet.min &&
            isSet.max
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: numberValidator.range.customMessage
                    .replace(numberValidator.replace.values.name.variable, name)
                    .replace(
                        numberValidator.replace.values.min.variable,
                        options.min.toString()
                    )
                    .replace(
                        numberValidator.replace.values.max.variable,
                        options.max.toString()
                    ),
                path: path,
            });
        } else if (
            isNotEmpty(options?.min) &&
            options?.min &&
            number < options.min &&
            isSet.min
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: numberValidator.min.customMessage
                    .replace(numberValidator.replace.values.name.variable, name)
                    .replace(
                        numberValidator.replace.values.min.variable,
                        options.min.toString()
                    ),
                path: path,
            });
        } else if (
            isNotEmpty(options?.max) &&
            options?.max &&
            number > options.max &&
            isSet.max
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: numberValidator.max.customMessage
                    .replace(numberValidator.replace.values.name.variable, name)
                    .replace(
                        numberValidator.replace.values.max.variable,
                        options.max.toString()
                    ),
                path: path,
            });
        } else if (set && set.has(number)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: numberValidator.duplicate.customMessage.replace(
                    numberValidator.replace.values.name.variable,
                    name
                ),
                path: path,
            });
        }
    } else {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: numberValidator.required.customMessage.replace(
                numberValidator.replace.values.name.variable,
                name
            ),
            path: path,
        });
    }
};

/**
 * Validate password of form schemas
 *
 * @param {string} name - The name of the password
 * @param {string | undefined} password - The password to validate
 * @param {z.RefinementCtx} ctx - The context of the schema
 * @param {(string | number)[]} path - The path of the schema
 * @param {Set<string>} set - The set of passwords
 * @param {{ required?: boolean }} options - The options of the schema
 */
export const schemaValidatePassword = (
    name: string = passwordValidator.replace.values.name.default,
    password: string | undefined,
    ctx: z.RefinementCtx,
    path: (string | number)[] = ["password"],
    set?: Set<string>,
    options?: {
        required?: boolean;
        min?: number;
        max?: number;
    }
) => {
    options = {
        required: false,
        min: passwordValidator.replace.values.min.default,
        max: passwordValidator.replace.values.max.default,
        ...options,
    };

    options.min = formatNumber(options.min);
    options.max = formatNumber(options.max);

    if (isNotEmpty(password) && password) {
        if (password.length < options.min) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: passwordValidator.min.customMessage
                    .replace(
                        passwordValidator.replace.values.name.variable,
                        name
                    )
                    .replace(
                        passwordValidator.replace.values.min.variable,
                        options.min.toString()
                    ),
                path: path,
            });
        } else if (password.length > options.max) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: passwordValidator.max.customMessage
                    .replace(
                        passwordValidator.replace.values.name.variable,
                        name
                    )
                    .replace(
                        passwordValidator.replace.values.max.variable,
                        options.max.toString()
                    ),
                path: path,
            });
        } else if (
            !password.match(
                new RegExp(
                    passwordValidator.regex.value,
                    passwordValidator.regex.flags
                )
            )
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: passwordValidator.regex.customMessage.replace(
                    passwordValidator.replace.values.name.variable,
                    name
                ),
                path: path,
            });
        } else if (set && set.has(password)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: passwordValidator.duplicate.customMessage.replace(
                    passwordValidator.replace.values.name.variable,
                    name
                ),
                path: path,
            });
        }
    } else if (options?.required && isEmpty(password)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: passwordValidator.required.customMessage.replace(
                passwordValidator.replace.values.name.variable,
                name
            ),
            path: path,
        });
    }
};

export const schemaValidateText = (
    name: string = textValidator.replace.values.name.default,
    text: string | undefined,
    ctx: z.RefinementCtx,
    path: (string | number)[] = ["text"],
    set?: Set<string>,
    options?: {
        required?: boolean;
        min?: number;
        max?: number;
    }
) => {
    const isSet = {
        min: isNumber(options?.min),
        max: isNumber(options?.max),
    };

    options = {
        min: textValidator.replace.values.min.default,
        max: textValidator.replace.values.max.default,
        required: false,
        ...options,
    };

    options.min = formatNumber(options.min);
    options.max = formatNumber(options.max);

    if (isNotEmpty(text) && text) {
        if (text.length < options.min && isSet.min) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: textValidator.min.customMessage
                    .replace(textValidator.replace.values.name.variable, name)
                    .replace(
                        textValidator.replace.values.min.variable,
                        options.min.toString()
                    ),
                path: path,
            });
        } else if (text.length > options.max && isSet.max) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: textValidator.max.customMessage
                    .replace(textValidator.replace.values.name.variable, name)
                    .replace(
                        textValidator.replace.values.max.variable,
                        options.max.toString()
                    ),
                path: path,
            });
        } else if (set && set.has(text)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: textValidator.duplicate.customMessage.replace(
                    textValidator.replace.values.name.variable,
                    name
                ),
                path: path,
            });
        }
    } else if (options?.required && isEmpty(text)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: textValidator.required.customMessage.replace(
                textValidator.replace.values.name.variable,
                name
            ),
            path: path,
        });
    }
};

/**
 * Validate url of form schemas
 *
 * @param {string} name - The name of the url
 * @param {string | undefined} url - The url to validate
 * @param {z.RefinementCtx} ctx - The context of the schema
 * @param {(string | number)[]} path - The path of the schema
 * @param {Set<string>} set - The set of urls
 * @param {{ required?: boolean }} options - The options of the schema
 * @returns {void}
 */
export const schemaValidateURL = (
    name: string = urlValidator.replace.values.name.default,
    url: string | undefined,
    ctx: z.RefinementCtx,
    path: (string | number)[] = ["url"],
    set?: Set<string>,
    options?: {
        required?: boolean;
    }
) => {
    if (isNotEmpty(url) && url) {
        if (!validator.isURL(url)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: urlValidator.valid.customMessage.replace(
                    urlValidator.replace.values.name.variable,
                    name
                ),
                path: path,
            });
        } else if (set && set.has(url)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: urlValidator.duplicate.customMessage.replace(
                    urlValidator.replace.values.name.variable,
                    name
                ),
                path: path,
            });
        }
    } else if (options?.required && isEmpty(url)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: urlValidator.required.customMessage.replace(
                urlValidator.replace.values.name.variable,
                name
            ),
            path: path,
        });
    }
};
