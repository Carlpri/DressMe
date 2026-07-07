import { z } from "zod";

export const registerSchema = z.object({
      name: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters")
      .max(100),

    email: z
      .string()
      .trim()
      .email("Please provide a valid email address"),

    password: z
      .string()
      .min(8, "Password must contain at least 8 characters")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/[0-9]/, "Password must contain a number")
      .regex(/[^A-Za-z0-9]/, "Password must contain a special character"),
  });


export type RegisterInput = z.infer<typeof registerSchema>;

[{
	"resource": "/c:/DressMe/DATABASE/package.json",
	"owner": "_generated_diagnostic_collection_name_#3",
	"code": "65541",
	"severity": 4,
	"message": "Unable to load schema from 'https://www.schemastore.org/package': Not Found. The requested location could not be found.\nUnable to connect to https://www.schemastore.org/package. Error: Client network socket disconnected before secure TLS connection was established.",
	"source": "json",
	"startLineNumber": 1,
	"startColumn": 1,
	"endLineNumber": 1,
	"endColumn": 2,
	"relatedInformation": [
		{
			"startLineNumber": 1,
			"startColumn": 1,
			"endLineNumber": 1,
			"endColumn": 1,
			"message": "Unable to load schema from 'https://www.schemastore.org/package': Not Found. The requested location could not be found.\nUnable to connect to https://www.schemastore.org/package. Error: Client network socket disconnected before secure TLS connection was established.",
			"resource": "/package"
		}
	],
	"modelVersionId": 45,
	"origin": "extHost1"
}]

export const loginSchema = z.object({
      email: z.email("Please provide a valid email address"),

    password: z.string().min(8, "Password must contain at least 8 characters"),
  
});
export type LoginInput = z.infer<typeof loginSchema>;