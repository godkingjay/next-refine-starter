import { formatNumber } from "@lib/format";
import { concatenate, isEmpty, isNotEmpty, isNumber } from "@lib/utils";
import validator from "validator";
import { z } from "zod";
import {
    birthdateValidator,
    codeValidator,
    dateValidator,
    emailValidator,
    genderValidator,
    generalNameValidator,
    nameValidator,
    numberValidator,
    passwordValidator,
    textValidator,
    urlValidator,
    usernameValidator,
} from "./schemas.rule";
import dayjs from "dayjs";

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
 * Validate date of form schemas
 *
 * @param {string} name - The name of the date
 * @param {string} date - The date to validate
 * @param {z.RefinementCtx} ctx - The context of the schema
 * @param {(string | number)[]} path - The path of the schema
 * @param {{ required?: boolean }} options - The options of the schema
 * @param {Set<string>} set - The set of dates
 * @returns {void}
 */
export const schemaValidateBirthdate = (
    name: string = birthdateValidator.replace.values.name.default,
    date: string | undefined,
    ctx: z.RefinementCtx,
    path: (string | number)[] = ["date"],
    set?: Set<string> | null,
    options?: {
        required?: boolean;
        min?: number;
        max?: number;
    }
) => {
    const isSet = {
        min: isNumber(birthdateValidator.min.value),
        max: isNumber(birthdateValidator.max.value),
    };

    options = {
        required: false,
        min: options?.min ?? birthdateValidator.replace.values.min.default,
        max: options?.max ?? birthdateValidator.replace.values.max.default,
        ...options,
    };

    options.min = formatNumber(options.min);
    options.max = formatNumber(options.max);

    if (isNotEmpty(date) && date) {
        try {
            const today = new Date();
            const birthdate = new Date(date);

            let age = today.getFullYear() - birthdate.getFullYear();
            const month = today.getMonth() - birthdate.getMonth();

            if (
                month < 0 ||
                (month === 0 && today.getDate() < birthdate.getDate())
            ) {
                age--;
            }

            if (
                age < birthdateValidator.min.value &&
                age < birthdateValidator.max.value &&
                (age < options.min || age > options.max) &&
                options.min &&
                options.max &&
                isSet.min &&
                isSet.max
            ) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: birthdateValidator.minMax.customMessage
                        .replace(
                            birthdateValidator.replace.values.name.variable,
                            name
                        )
                        .replace(
                            birthdateValidator.replace.values.min.variable,
                            options.min.toString()
                        )
                        .replace(
                            birthdateValidator.replace.values.max.variable,
                            options.max.toString()
                        ),

                    path: path,
                });
            } else if (
                age < birthdateValidator.min.value &&
                age < options.min &&
                options.min &&
                isSet.min
            ) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: birthdateValidator.min.customMessage
                        .replace(
                            birthdateValidator.replace.values.name.variable,
                            name
                        )
                        .replace(
                            birthdateValidator.replace.values.min.variable,
                            options.min.toString()
                        ),
                    path: path,
                });
            } else if (
                age > birthdateValidator.max.value &&
                age > options.max &&
                options.max &&
                isSet.max
            ) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: birthdateValidator.max.customMessage
                        .replace(
                            birthdateValidator.replace.values.name.variable,
                            name
                        )
                        .replace(
                            birthdateValidator.replace.values.max.variable,
                            options.max.toString()
                        ),
                    path: path,
                });
            } else if (set && set.has(date)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: birthdateValidator.duplicate.customMessage.replace(
                        birthdateValidator.replace.values.name.variable,
                        name
                    ),
                    path: path,
                });
            }
        } catch (err) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: birthdateValidator.valid.message,
                path: path,
            });
        }

        if (
            !date.match(
                new RegExp(
                    birthdateValidator.regex.value,
                    birthdateValidator.regex.flags
                )
            )
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: birthdateValidator.regex.message,
                path: path,
            });
        } else if (set && set.has(date)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: birthdateValidator.duplicate.message,
                path: path,
            });
        }
    } else if (options?.required && isEmpty(date)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: birthdateValidator.required.message,
            path: path,
        });
    }
};

/**
 * Validate code of form schemas
 *
 * @param {string} name - The name of the code
 * @param {string} code - The code to validate
 * @param {z.RefinementCtx} ctx - The context of the schema
 * @param {(string | number)[]} path - The path of the schema
 * @param {(string | number)[]} set - The set of codes
 * @param {{
 * 		required?: boolean;
 * 		minLength?: number;
 * 		minLength?: number;
 * }} options - The options of the schema
 * @returns {void}
 */
export const schemaValidateCode = (
    name: string = codeValidator.replace.values.name.default,
    code: string | undefined,
    ctx: z.RefinementCtx,
    path: (string | number)[] = ["code"],
    set?: Set<string>,
    options?: {
        required?: boolean;
        min?: number;
        max?: number;
    }
) => {
    options = {
        required: false,
        min: options?.min && codeValidator.replace.values.min.default,
        max: options?.max && codeValidator.replace.values.max.default,
        ...options,
    };

    options.min = formatNumber(options.min);
    options.max = formatNumber(options.max);

    if (isNotEmpty(code) && code) {
        if (
            isNotEmpty(options.min) &&
            options.min &&
            code.length < options?.min
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: codeValidator.min.customMessage
                    .replace(codeValidator.replace.values.name.variable, name)
                    .replace(
                        codeValidator.replace.values.min.variable,
                        options.min.toString()
                    ),
                path: path,
            });
        } else if (
            isNotEmpty(options.max) &&
            options.max &&
            code.length > options?.max
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: codeValidator.max.customMessage
                    .replace(codeValidator.replace.values.name.variable, name)
                    .replace(
                        codeValidator.replace.values.max.variable,
                        options.max.toString()
                    ),
                path: path,
            });
        } else if (
            !code.match(
                new RegExp(codeValidator.regex.value, codeValidator.regex.flags)
            )
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: codeValidator.valid.customMessage.replace(
                    codeValidator.replace.values.name.variable,
                    name
                ),
                path: path,
            });
        } else if (set && set.has(code)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: codeValidator.duplicate.customMessage.replace(
                    codeValidator.replace.values.name.variable,
                    name
                ),
                path: path,
            });
        }
    } else if (options?.required && isEmpty(code)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: codeValidator.required.customMessage.replace(
                codeValidator.replace.values.name.variable,
                name
            ),
            path: path,
        });
    }
};

/**
 * Validate date of form schemas
 *
 * @param {string} name - The name of the date
 * @param {string} date - The date to validate
 * @param {z.RefinementCtx} ctx - The context of the schema
 * @param {(string | number)[]} path - The path of the schema
 * @param {Set<string>} set - The set of dates
 * @param {{ required?: boolean }} options - The options of the schema
 * @returns {void}
 */
export const schemaValidateDate = (
    name: string = dateValidator.replace.values.name.default,
    date: string | undefined,
    ctx: z.RefinementCtx,
    path: (string | number)[] = ["date"],
    set?: Set<string> | null,
    options?: {
        required?: boolean;
        minDate?: string | null;
        maxDate?: string | null;
    }
) => {
    options = {
        required: false,
        minDate:
            options?.minDate ?? dateValidator.replace.values.minDate.default,
        maxDate:
            options?.maxDate ?? dateValidator.replace.values.maxDate.default,
        ...options,
    };

    options.minDate = dayjs(options.minDate).format(
        dateValidator.replace.values.format.default
    );
    options.maxDate = dayjs(options.maxDate).format(
        dateValidator.replace.values.format.default
    );

    if (isNotEmpty(date) && date) {
        if (
            !date.match(
                new RegExp(dateValidator.regex.value, dateValidator.regex.flags)
            )
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: dateValidator.valid.customMessage.replace(
                    dateValidator.replace.values.name.variable,
                    name
                ),
                path: path,
            });
        } else if (
            isNotEmpty(options?.minDate) &&
            options?.minDate &&
            date < options.minDate
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: dateValidator.minDate.customMessage
                    .replace(dateValidator.replace.values.name.variable, name)
                    .replace(
                        dateValidator.replace.values.minDate.variable,
                        options.minDate
                    ),
                path: path,
            });
        } else if (
            isNotEmpty(options?.maxDate) &&
            options?.maxDate &&
            date > options.maxDate
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: dateValidator.maxDate.customMessage
                    .replace(dateValidator.replace.values.name.variable, name)
                    .replace(
                        dateValidator.replace.values.maxDate.variable,
                        options.maxDate
                    ),
                path: path,
            });
        } else if (set && set.has(date)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: dateValidator.duplicate.customMessage.replace(
                    dateValidator.replace.values.name.variable,
                    name
                ),
                path: path,
            });
        }
    } else if (options?.required && isEmpty(date)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: dateValidator.required.customMessage.replace(
                dateValidator.replace.values.name.variable,
                name
            ),
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
 * Validate gender of form schemas
 *
 * @param {string} name - The name of the gender
 * @param {string} gender - The gender to validate
 * @param {z.RefinementCtx} ctx - The context of the schema
 * @param {(string | number)[]} path - The path of the schema
 * @param {Set<string>} set - The set of company sizes
 * @param {{
 * 	required?: boolean;
 *  choices?: string[];
 * }} options - The options of the schema
 * @returns {void}
 */
export const schemaValidateGender = (
    name: string = genderValidator.replace.values.name.default,
    gender: string | undefined,
    ctx: z.RefinementCtx,
    path: (string | number)[] = ["gender"],
    set?: Set<string>,
    options?: {
        required?: boolean;
        choices?: string[];
    }
) => {
    if (isNotEmpty(gender) && gender) {
        if (
            isNotEmpty(options?.choices) &&
            options?.choices &&
            !options.choices.includes(gender)
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: genderValidator.values.customMessage
                    .replace(genderValidator.replace.values.name.variable, name)
                    .replace(
                        genderValidator.replace.values.choices.variable,
                        concatenate(", ", ...options.choices)
                    ),
                path: path,
            });
        } else if (set && set.has(gender)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: genderValidator.duplicate.customMessage.replace(
                    genderValidator.replace.values.name.variable,
                    name
                ),
                path: path,
            });
        }
    } else if (options?.required && isEmpty(gender)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: genderValidator.required.customMessage.replace(
                genderValidator.replace.values.name.variable,
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

/**
 * Validate username of form schemas
 *
 * @param {string} name - The name of the username
 * @param {string | undefined} username - The username to validate
 * @param {z.RefinementCtx} ctx - The context of the schema
 * @param {(string | number)[]} usernamePath - The path of the username
 * @param {Set<string>} set - The set of usernames
 * @param {{ required?: boolean }} options - The options of the schema
 * @returns {void}
 */
export const schemaValidateUsername = (
    name: string = usernameValidator.replace.values.name.default,
    username: string | undefined,
    ctx: z.RefinementCtx,
    usernamePath: (string | number)[] = ["username"],
    set?: Set<string>,
    options?: {
        required?: boolean;
        min?: number;
        max?: number;
    }
) => {
    options = {
        required: false,
        min: usernameValidator.replace.values.min.default,
        max: usernameValidator.replace.values.max.default,
        ...options,
    };

    options.min = formatNumber(options.min);
    options.max = formatNumber(options.max);

    if (isNotEmpty(username) && username) {
        if (username.length < options.min) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: usernameValidator.min.customMessage
                    .replace(
                        usernameValidator.replace.values.name.variable,
                        name
                    )
                    .replace(
                        usernameValidator.replace.values.min.variable,
                        options.min.toString()
                    ),
                path: usernamePath,
            });
        } else if (username.length > options.max) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: usernameValidator.max.customMessage
                    .replace(
                        usernameValidator.replace.values.name.variable,
                        name
                    )
                    .replace(
                        usernameValidator.replace.values.max.variable,
                        options.max.toString()
                    ),
                path: usernamePath,
            });
        } else if (
            !username.match(
                new RegExp(
                    usernameValidator.regex.value,
                    usernameValidator.regex.flags
                )
            )
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: usernameValidator.regex.customMessage.replace(
                    usernameValidator.replace.values.name.variable,
                    name
                ),
                path: usernamePath,
            });
        } else if (set && set.has(username)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: usernameValidator.duplicate.customMessage.replace(
                    usernameValidator.replace.values.name.variable,
                    name
                ),
                path: usernamePath,
            });
        }
    } else if (options?.required && isEmpty(username)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: usernameValidator.required.customMessage.replace(
                usernameValidator.replace.values.name.variable,
                name
            ),
            path: usernamePath,
        });
    }
};
